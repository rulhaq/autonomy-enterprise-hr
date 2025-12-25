/**
 * Client-side chat service that calls Groq directly via REST API
 * No Next.js API routes needed - works with static hosting
 */

import { getUser, getLeaveBalance, searchHRDocuments } from './firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { User } from '@/lib/types';

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chatWithGroq(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  userId: string,
  language: string = 'en',
  useRAG: boolean = true
): Promise<string> {
  try {
    // Get user data for context
    let user: User | null = null;
    let userRole = 'employee';
    let userName = 'Employee';
    let leaveBalanceText = '';
    let teamInfoText = '';

    try {
      user = await getUser(userId);
      userRole = user?.role || 'employee';
      userName = user?.name || 'Employee';

      // Get leave balance for context
      const leaveBalance = await getLeaveBalance(userId);
      if (leaveBalance) {
        leaveBalanceText = `
Leave Balance:
- Annual Leave: ${leaveBalance.annual.available} days available (${leaveBalance.annual.used} used, ${leaveBalance.annual.pending} pending)
- Sick Leave: ${leaveBalance.sick.available} days available (${leaveBalance.sick.used} used)
- Emergency Leave: ${leaveBalance.emergency.available} days available (${leaveBalance.emergency.used} used)
`;
      }

      // If user is a manager, get team member information
      if (userRole === 'manager' || userRole === 'admin' || userRole === 'hr') {
        try {
          const teamQuery = query(
            collection(db, 'users'),
            where('managerId', '==', userId)
          );
          const teamSnapshot = await getDocs(teamQuery);
          const teamMembers = teamSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              employeeId: data.employeeId,
              position: data.position,
              department: data.department,
              email: data.email,
              site: data.site || 'Not assigned',
              projects: data.projects || [],
              status: data.status || 'available',
            };
          });

          if (teamMembers.length > 0) {
            teamInfoText = `\n\nTeam Members (Direct Reports):\n`;
            for (const member of teamMembers) {
              // Get current leave status
              const memberLeaveQuery = query(
                collection(db, 'leaveApplications'),
                where('employeeId', '==', member.id),
                where('status', 'in', ['pending', 'approved'])
              );
              const memberLeaveSnapshot = await getDocs(memberLeaveQuery);
              const memberLeaves = memberLeaveSnapshot.docs.map(d => ({
                ...d.data(),
                startDate: d.data().startDate?.toDate(),
                endDate: d.data().endDate?.toDate(),
                leaveType: d.data().leaveType,
              }));

              const today = new Date();
              const currentLeave = memberLeaves.find((l: any) => {
                const start = l.startDate;
                const end = l.endDate;
                return start <= today && end >= today;
              });

              teamInfoText += `\n- ${member.name} (${member.employeeId}):\n`;
              teamInfoText += `  Position: ${member.position}\n`;
              teamInfoText += `  Department: ${member.department}\n`;
              teamInfoText += `  Site: ${member.site}\n`;
              teamInfoText += `  Projects: ${member.projects.length > 0 ? member.projects.join(', ') : 'None'}\n`;
              teamInfoText += `  Status: ${member.status}${currentLeave ? ` (On ${(currentLeave as any).leaveType} leave until ${currentLeave.endDate.toLocaleDateString()})` : ''}\n`;
              
              // Get leave balance
              const memberBalance = await getLeaveBalance(member.id);
              if (memberBalance) {
                teamInfoText += `  Leave Balance: Annual ${memberBalance.annual.available} days, Sick ${memberBalance.sick.available} days\n`;
              }
            }
          }
        } catch (error) {
          console.error('Error fetching team data:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }

    // Build enhanced system prompt with HR context
    const systemPrompt = `You are an intelligent HR Assistant for a company with 10,000 employees. Your mission is to help employees with:
- Leave applications and balances
- Payslips and salary information  
- Company policies and documents
- Performance reviews and appraisals
- Organizational hierarchy
- Benefits and general HR inquiries

User Information:
- Name: ${userName}
- Role: ${userRole}
- Employee ID: ${user?.employeeId || 'N/A'}
- Department: ${user?.department || 'N/A'}
${leaveBalanceText}${teamInfoText}

IMPORTANT FOR MANAGERS:
- You can answer questions about team members by name or employee ID
- You have access to their projects, sites, leave status, and leave balances
- You can help approve leave requests, check team availability, and provide team insights
- When asked about an employee, provide their current status, projects, site location, and leave information

Be professional, empathetic, and accurate. Always provide actionable information based on the user's actual data. If you don't know something, say so and suggest contacting HR.

Current date: ${new Date().toLocaleDateString()}
Language preference: ${language || 'en'}

CRITICAL LANGUAGE INSTRUCTION:
- You MUST respond in ${language || 'en'} language
- If language is 'ar' (Arabic), respond in Arabic with RTL formatting
- If language is 'hi' (Hindi), respond in Hindi
- If language is 'ur' (Urdu), respond in Urdu
- If language is 'tl' (Tagalog), respond in Tagalog
- If language is 'ml' (Malayalam), respond in Malayalam
- If language is 'ta' (Tamil), respond in Tamil
- If language is 'ne' (Nepalese), respond in Nepalese (नेपाली)
- If language is 'en' (English), respond in English
- Always maintain the same language throughout the conversation
- Translate all responses to match the user's language preference

IMPORTANT: 
- Never hallucinate or make up information
- Use the actual user data provided above
- If query is about leave, use the exact leave balance numbers shown
- If you don't know something, say so and suggest contacting HR
- For leave applications, guide users to use the leave application form
- For payslips, inform users they can download from the quick actions`;

    // Prepare messages array
    const formattedMessages: ChatMessage[] = messages.map((msg) => ({
      role: (msg.role === 'user' ? 'user' : msg.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: msg.content || '',
    })).filter((msg) => msg.content.trim().length > 0) as ChatMessage[];

    let enhancedMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...formattedMessages,
    ];

    // Add RAG context if enabled
    if (useRAG !== false) {
      try {
        const lastMessage = messages[messages.length - 1]?.content || '';
        const relevantDocs = await searchHRDocuments(lastMessage, 10);
        if (relevantDocs.length > 0) {
          const docsContext = relevantDocs.map(doc => 
            `Document: ${doc.title}\nCategory: ${doc.category}\nVersion: ${doc.version}\nTags: ${Array.isArray(doc.tags) ? doc.tags.join(', ') : ''}\nContent: ${doc.content.substring(0, 1000)}...`
          ).join('\n\n---\n\n');
          enhancedMessages[0].content += `\n\nRelevant HR Documents from Knowledge Base (RAG):\n${docsContext}\n\nIMPORTANT: Use this information to answer questions accurately. Always cite the document name and version when referencing policies. If the user asks about something covered in these documents, provide specific details from the documents.`;
        }
      } catch (error) {
        console.error('Error searching documents:', error);
      }
    }

    // Call Groq API directly via REST (works in browser)
    console.log('Calling Groq API directly from client via REST...');
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: enhancedMessages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
    }

    const completion = await response.json();
    const assistantMessage = completion.choices?.[0]?.message?.content;
    
    if (!assistantMessage) {
      throw new Error('No response from AI');
    }

    return assistantMessage;
  } catch (error: any) {
    console.error('Chat client error:', error);
    throw error;
  }
}

