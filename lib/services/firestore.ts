/**
 * Autonomy Enterprise HR Assistant
 * 
 * Copyright (c) 2025 Scalovate Systems Solutions
 * 
 * MIT License (Educational Use) - See LICENSE file for details
 * 
 * DISCLAIMER:
 * This software is provided for EDUCATIONAL PURPOSES ONLY and "as is" without warranty
 * of any kind. Users must configure their own Firebase project and Groq API keys.
 * 
 * IMPORTANT RESTRICTIONS:
 * - Educational use only
 * - Reselling is NOT allowed
 * - For customization/modification, contact support@scalovate.com
 * - Replace demo credentials with your own before any use
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { User, LeaveApplication, LeaveBalance, Payslip, ChatMessage, Conversation, HRDocument } from '@/lib/types';

// User Operations
export async function getUser(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: userDoc.id,
        ...data,
        joinDate: data.joinDate?.toDate ? data.joinDate.toDate() : (data.joinDate || new Date()),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date()),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt || new Date()),
      } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function createOrUpdateUser(user: Partial<User>): Promise<void> {
  try {
    if (!user.id) throw new Error('User ID is required');
    
    // Only allow employees to update specific fields
    const updateData: any = {
      updatedAt: serverTimestamp(),
    };

    // Employees can update: phone, language
    // Managers/HR can update: all fields
    if (user.phone !== undefined) {
      updateData.phone = user.phone;
    }
    if (user.language !== undefined) {
      updateData.language = user.language;
    }
    
    // Only allow managers/HR to update other fields
    // In production, check user role before allowing updates to other fields
    if (user.name !== undefined) updateData.name = user.name;
    if (user.department !== undefined) updateData.department = user.department;
    if (user.position !== undefined) updateData.position = user.position;
    if (user.managerId !== undefined) updateData.managerId = user.managerId;
    if (user.role !== undefined) updateData.role = user.role;
    if (user.employeeId !== undefined) updateData.employeeId = user.employeeId;
    if (user.joinDate !== undefined) updateData.joinDate = user.joinDate;

    await setDoc(doc(db, 'users', user.id), updateData, { merge: true });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

// Leave Operations
export async function getLeaveBalance(userId: string): Promise<LeaveBalance | null> {
  try {
    const balanceDoc = await getDoc(doc(db, 'leaveBalances', userId));
    if (balanceDoc.exists()) {
      return { id: balanceDoc.id, ...balanceDoc.data() } as unknown as LeaveBalance;
    }
    // Return default balance if not found
    return {
      employeeId: userId,
      annual: { earned: 20, used: 0, available: 20, pending: 0 },
      sick: { earned: 10, used: 0, available: 10, pending: 0 },
      emergency: { earned: 5, used: 0, available: 5, pending: 0 },
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Error getting leave balance:', error);
    return null;
  }
}

export async function createLeaveApplication(application: Omit<LeaveApplication, 'id' | 'submittedAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'leaveApplications'), {
      ...application,
      submittedAt: serverTimestamp(),
      status: 'pending',
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating leave application:', error);
    throw error;
  }
}

export async function getLeaveApplications(userId: string, limitCount: number = 10): Promise<LeaveApplication[]> {
  try {
    const q = query(
      collection(db, 'leaveApplications'),
      where('employeeId', '==', userId),
      orderBy('submittedAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate() || new Date(),
      startDate: doc.data().startDate?.toDate() || new Date(),
      endDate: doc.data().endDate?.toDate() || new Date(),
    })) as LeaveApplication[];
  } catch (error) {
    console.error('Error getting leave applications:', error);
    return [];
  }
}

// Payslip Operations
export async function getPayslip(userId: string, month: number, year: number): Promise<Payslip | null> {
  try {
    const payslipId = `${userId}_${year}_${month}`;
    const payslipDoc = await getDoc(doc(db, 'payslips', payslipId));
    if (payslipDoc.exists()) {
      return { id: payslipDoc.id, ...payslipDoc.data() } as Payslip;
    }
    return null;
  } catch (error) {
    console.error('Error getting payslip:', error);
    return null;
  }
}

export async function getPayslips(userId: string, limitCount: number = 12): Promise<Payslip[]> {
  try {
    const q = query(
      collection(db, 'payslips'),
      where('employeeId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Payslip[];
  } catch (error) {
    console.error('Error getting payslips:', error);
    return [];
  }
}

// Chat Operations
export async function saveConversation(conversation: Omit<Conversation, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'conversations'), {
      ...conversation,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw error;
  }
}

export async function updateConversation(conversationId: string, updates: Partial<Conversation>): Promise<void> {
  try {
    await updateDoc(doc(db, 'conversations', conversationId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating conversation:', error);
    throw error;
  }
}

export async function getConversations(userId: string, limitCount: number = 20): Promise<Conversation[]> {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      messages: doc.data().messages.map((m: any) => ({
        ...m,
        timestamp: m.timestamp?.toDate() || new Date(),
      })),
    })) as Conversation[];
  } catch (error) {
    console.error('Error getting conversations:', error);
    return [];
  }
}

// HR Documents (RAG)
export async function searchHRDocuments(searchQuery: string, limitCount: number = 10): Promise<HRDocument[]> {
  try {
    // TODO: Implement vector similarity search if embeddings are available
    // For now, use keyword search with ranking
    
    const q = query(
      collection(db, 'hrDocuments'),
      orderBy('updatedAt', 'desc'),
      limit(limitCount * 2) // Get more to filter
    );
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as HRDocument[];
    
    // Enhanced keyword matching with scoring
    const queryLower = searchQuery.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
    
    const scoredDocs = docs.map(doc => {
      let score = 0;
      const title = doc.title?.toLowerCase() || '';
      const content = doc.content?.toLowerCase() || '';
      const tags = Array.isArray(doc.tags) ? doc.tags.map((t: string) => t.toLowerCase()) : [];
      
      // Title matches are highest priority
      if (title.includes(queryLower)) score += 10;
      queryWords.forEach(word => {
        if (title.includes(word)) score += 5;
      });
      
      // Content matches
      if (content.includes(queryLower)) score += 5;
      queryWords.forEach(word => {
        const matches = (content.match(new RegExp(word, 'g')) || []).length;
        score += matches;
      });
      
      // Tag matches
      tags.forEach(tag => {
        if (tag.includes(queryLower)) score += 3;
        queryWords.forEach(word => {
          if (tag.includes(word)) score += 2;
        });
      });
      
      return { doc, score };
    }).filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limitCount)
      .map(item => item.doc);
    
    return scoredDocs;
  } catch (error) {
    console.error('Error searching HR documents:', error);
    return [];
  }
}

export async function getHRDocument(id: string): Promise<HRDocument | null> {
  try {
    const docRef = await getDoc(doc(db, 'hrDocuments', id));
    if (docRef.exists()) {
      return {
        id: docRef.id,
        ...docRef.data(),
        createdAt: docRef.data().createdAt?.toDate() || new Date(),
        updatedAt: docRef.data().updatedAt?.toDate() || new Date(),
      } as HRDocument;
    }
    return null;
  } catch (error) {
    console.error('Error getting HR document:', error);
    return null;
  }
}

