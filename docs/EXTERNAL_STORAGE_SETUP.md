# External Storage Setup Guide

This guide explains how to configure and use external storage connectors for syncing documents to the HR Assistant RAG system.

## Overview

The HR Assistant supports three types of external storage:
1. **Google Drive** - OAuth 2.0 authentication
2. **SharePoint** - Microsoft Graph API authentication
3. **File Server** - SMB/CIFS protocol (requires server-side implementation)

## Google Drive Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Drive API**

### 2. Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Add authorized redirect URI:
   ```
   http://localhost:3000/api/storage/google-drive/callback  (development)
   https://yourdomain.com/api/storage/google-drive/callback  (production)
   ```
5. Copy the **Client ID** and **Client Secret**

### 3. Configure Environment Variables

Add to your `.env.local` or production environment:

```env
GOOGLE_DRIVE_CLIENT_ID=your_client_id_here
GOOGLE_DRIVE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 4. Usage

1. Go to Admin Panel > Storage
2. Click **Connect** on Google Drive
3. Authorize the application
4. Optionally specify a folder ID to sync only that folder
5. Click **Sync Documents** to import files

## SharePoint Setup

### 1. Register Azure AD Application

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Set redirect URI:
   ```
   http://localhost:3000/api/storage/sharepoint/callback  (development)
   https://yourdomain.com/api/storage/sharepoint/callback  (production)
   ```
5. Under **API permissions**, add:
   - `Files.Read.All` (Application permission)
   - `Sites.Read.All` (Application permission)
6. Grant admin consent
7. Go to **Certificates & secrets** and create a new client secret
8. Copy the **Application (client) ID**, **Directory (tenant) ID**, and **Client secret**

### 2. Configure Environment Variables

```env
SHAREPOINT_CLIENT_ID=your_client_id_here
SHAREPOINT_CLIENT_SECRET=your_client_secret_here
SHAREPOINT_TENANT_ID=your_tenant_id_or_common
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Usage

1. Go to Admin Panel > Storage
2. Click **Connect** on SharePoint
3. Sign in with Microsoft account
4. Enter your SharePoint Site URL (e.g., `https://yourcompany.sharepoint.com/sites/HR`)
5. Optionally specify Document Library name (default: "Documents")
6. Click **Sync Documents** to import files

## File Server Setup

### 1. Requirements

File server connection requires server-side SMB/CIFS implementation. For production, you'll need:

- Node.js server with `smb2` library (or similar)
- Network access to the file server
- Valid credentials

### 2. Install SMB Library (Server-Side)

```bash
npm install smb2
```

### 3. Configure Environment Variables

```env
FILE_SERVER_ENCRYPTION_KEY=your_strong_encryption_key_here
```

**Important**: Use a strong, random encryption key in production. Credentials are encrypted before storage.

### 4. Usage

1. Go to Admin Panel > Storage
2. Enter server path (e.g., `\\server\share\folder`)
3. Enter username and password
4. Click **Connect & Test**
5. Once connected, click **Sync Documents**

### 5. Server-Side Implementation

For full functionality, implement the SMB connection in your server-side code:

```javascript
const SMB2 = require('smb2');

const smb2Client = new SMB2({
  share: '\\\\server\\share',
  domain: 'WORKGROUP',
  username: 'username',
  password: 'password',
});

// List files
const files = await smb2Client.readdir('/folder');

// Read file
const fileContent = await smb2Client.readFile('/folder/document.pdf');
```

## Security Considerations

1. **OAuth Tokens**: Stored in HTTP-only cookies, expire after 7 days
2. **File Server Credentials**: Encrypted before storage in Firestore
3. **API Keys**: Never expose client secrets in client-side code
4. **Firestore Rules**: Storage connections are user-scoped and admin-accessible

## Troubleshooting

### Google Drive
- **"Redirect URI mismatch"**: Ensure redirect URI matches exactly in Google Cloud Console
- **"Access denied"**: Check API permissions and scopes
- **"Token expired"**: Tokens auto-refresh, but may require re-authentication

### SharePoint
- **"Invalid tenant"**: Use `common` for multi-tenant or specific tenant ID
- **"Permission denied"**: Ensure admin consent is granted for API permissions
- **"Site not found"**: Verify site URL format and permissions

### File Server
- **"Connection failed"**: Verify network access and credentials
- **"SMB not available"**: Requires server-side implementation with smb2 library
- **"Path invalid"**: Use Windows UNC path format: `\\server\share\folder`

## Supported File Types

All connectors support:
- PDF (`.pdf`)
- Microsoft Word (`.doc`, `.docx`)
- Microsoft Excel (`.xls`, `.xlsx`)
- Text files (`.txt`)
- PowerPoint (`.ppt`, `.pptx`)

Google Drive also supports:
- Google Docs (exported as PDF)
- Google Sheets (exported as Excel)

## Document Processing

Synced documents are:
1. Downloaded from the source
2. Uploaded to Firebase Storage
3. Text extracted (basic extraction, full parsing requires additional libraries)
4. Saved to Firestore with metadata
5. Available for RAG search

## Production Checklist

- [ ] Configure all environment variables
- [ ] Set up OAuth applications
- [ ] Test authentication flows
- [ ] Verify Firestore security rules
- [ ] Set strong encryption key for file server
- [ ] Implement server-side SMB connection (if using file server)
- [ ] Test document syncing
- [ ] Monitor API rate limits
- [ ] Set up error logging and alerts

