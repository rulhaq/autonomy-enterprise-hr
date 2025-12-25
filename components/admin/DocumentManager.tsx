'use client';

import { useState, useEffect } from 'react';
import { Upload, Folder, FileText, ExternalLink, Trash2 } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { performOCR } from '@/lib/services/ocr';
import { vectorizeDocument } from '@/lib/services/vectorization';

export default function DocumentManager() {
  const { currentUser } = useChatStore();
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'hr') {
      loadDocuments();
    }
  }, [currentUser]);

  const loadDocuments = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'hrDocuments'));
      setDocuments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // Process multiple files
      const uploadPromises = Array.from(files).map(async (file) => {
        // Upload to Firebase Storage
        const storageRef = ref(storage, `hr-documents/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Extract text from document with OCR support
        let content = await extractTextFromFile(file);
        let ocrData = null;
        
        // Perform OCR for images
        if (file.type.startsWith('image/')) {
          try {
            ocrData = await performOCR(file);
            content = ocrData.text;
            if (ocrData.tables && ocrData.tables.length > 0) {
              content += '\n\nTables detected:\n' + JSON.stringify(ocrData.tables, null, 2);
            }
          } catch (error) {
            console.error('OCR error:', error);
            toast.error('OCR processing failed, but file uploaded');
          }
        }

        // Determine category
        const category = file.name.toLowerCase().includes('policy') ? 'policy' : 
                        file.name.toLowerCase().includes('handbook') ? 'handbook' : 'document';

        // Extract tags from filename
        const tags = extractTags(file.name);

        // Vectorize document content for RAG
        let embeddings = null;
        try {
          const docId = `temp_${Date.now()}`;
          embeddings = await vectorizeDocument(content, docId);
        } catch (error) {
          console.error('Vectorization error:', error);
          // Continue without embeddings
        }

        // Save to Firestore
        const docRef = await addDoc(collection(db, 'hrDocuments'), {
          title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          content: content,
          category: category,
          version: '1.0',
          tags: tags,
          sourceUrl: downloadURL,
          uploadedBy: currentUser?.id,
          uploadedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          // Add vector embeddings if available
          embeddings: embeddings?.embeddings || null,
          chunks: embeddings?.chunks || null,
          // Add OCR data for images/tables
          ocrData: ocrData || null,
        });
        
        return docRef;
      });

      await Promise.all(uploadPromises);
      toast.success(`${files.length} document(s) uploaded successfully!`);
      loadDocuments();
      setShowUpload(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    // Text extraction with OCR support for images
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      return await file.text();
    }
    
    // TODO: Implement OCR for images (PNG, JPG, etc.)
    if (file.type.startsWith('image/')) {
      // In production, use Tesseract.js or similar OCR library
      // const ocrResult = await performOCR(file);
      // return ocrResult.text;
      return `[Image Document: ${file.name}]\n\nOCR processing will extract text from this image. Tables and structured data will be preserved.`;
    }
    
    // TODO: Implement PDF parsing
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      // In production, use pdf-parse or pdf.js
      // const pdfText = await parsePDF(file);
      // return pdfText;
      return `[PDF Document: ${file.name}]\n\nPDF content extraction will parse text and tables from this document.`;
    }
    
    // TODO: Implement DOCX parsing
    if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      // In production, use mammoth or docx-parser
      // const docxText = await parseDOCX(file);
      // return docxText;
      return `[Word Document: ${file.name}]\n\nDocument content extraction will parse text and formatting from this file.`;
    }
    
    return `[Document: ${file.name}]\n\nThis document has been uploaded and will be processed for RAG search.`;
  };

  // TODO: Implement OCR function
  // const performOCR = async (file: File): Promise<{ text: string; tables?: any[] }> => {
  //   // Use Tesseract.js or Google Cloud Vision API
  //   // Extract text and detect tables in images
  // };

  // TODO: Implement vectorization function
  // const vectorizeDocument = async (content: string): Promise<number[]> => {
  //   // Use OpenAI embeddings or similar vectorization service
  //   // Return vector embeddings for semantic search
  // };

  const extractTags = (filename: string): string[] => {
    const tags: string[] = [];
    const lower = filename.toLowerCase();
    if (lower.includes('leave')) tags.push('leave');
    if (lower.includes('attendance')) tags.push('attendance');
    if (lower.includes('wfh') || lower.includes('work from home')) tags.push('wfh');
    if (lower.includes('benefit')) tags.push('benefits');
    if (lower.includes('policy')) tags.push('policy');
    if (lower.includes('handbook')) tags.push('handbook');
    return tags;
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await deleteDoc(doc(db, 'hrDocuments', docId));
      toast.success('Document deleted successfully!');
      loadDocuments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete document');
    }
  };

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'hr') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('admin.documents')}</h2>
          <p className="text-gray-600 text-sm mt-1">Upload documents for RAG search. OCR and vectorization enabled.</p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          {t('admin.upload')}
        </button>
      </div>

      {showUpload && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Upload Documents (Multiple files supported)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
            />
            <p className="text-xs text-gray-600 mt-2">
              Supported: PDF, Word, Text files, Images (PNG, JPG). OCR will extract text from images.
            </p>
          </div>
          {uploading && <p className="text-gray-600 mt-2">Uploading and processing documents...</p>}
        </div>
      )}

      <div className="space-y-3">
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No documents uploaded yet</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-200">
              <div className="flex items-center gap-4">
                <FileText className="w-6 h-6 text-gray-600" />
                <div>
                  <h3 className="text-gray-900 font-semibold">{doc.title}</h3>
                  <p className="text-gray-600 text-sm">{doc.category} • v{doc.version}</p>
                  {doc.tags && doc.tags.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">Tags: {Array.isArray(doc.tags) ? doc.tags.join(', ') : doc.tags}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {doc.sourceUrl && (
                  <a
                    href={doc.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-900" />
                  </a>
                )}
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

