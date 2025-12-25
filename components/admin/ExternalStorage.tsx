'use client';

import { useState, useEffect } from 'react';
import { Cloud, Folder, Server, Save, CheckCircle, RefreshCw, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useChatStore } from '@/lib/store/chatStore';

export default function ExternalStorage() {
  const { currentUser } = useChatStore();
  const [connections, setConnections] = useState({
    googleDrive: { connected: false, folderId: '', syncing: false },
    sharepoint: { connected: false, siteUrl: '', libraryName: '', syncing: false },
    fileServer: { connected: false, serverPath: '', username: '', password: '', connectionId: '', syncing: false },
  });

  useEffect(() => {
    // Check URL params for OAuth callbacks
    const params = new URLSearchParams(window.location.search);
    const storage = params.get('storage');
    const success = params.get('success');
    const error = params.get('error');

    if (storage && success) {
      if (storage === 'google-drive') {
        setConnections(prev => ({ ...prev, googleDrive: { ...prev.googleDrive, connected: true } }));
        toast.success('Google Drive connected successfully!');
      } else if (storage === 'sharepoint') {
        setConnections(prev => ({ ...prev, sharepoint: { ...prev.sharepoint, connected: true } }));
        toast.success('SharePoint connected successfully!');
      }
      // Clean URL
      window.history.replaceState({}, '', '/admin');
    }

    if (storage && error) {
      toast.error(`Failed to connect to ${storage}: ${error}`);
      window.history.replaceState({}, '', '/admin');
    }
  }, []);

  const handleGoogleDriveConnect = async () => {
    try {
      window.location.href = '/api/storage/google-drive/auth';
    } catch (error: any) {
      toast.error('Failed to initiate Google Drive connection');
    }
  };

  const handleGoogleDriveSync = async () => {
    if (!connections.googleDrive.connected) {
      toast.error('Please connect to Google Drive first');
      return;
    }

    setConnections(prev => ({ ...prev, googleDrive: { ...prev.googleDrive, syncing: true } }));

    try {
      const response = await fetch('/api/storage/google-drive/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folderId: connections.googleDrive.folderId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sync failed');
      }

      toast.success(`Synced ${data.synced} documents from Google Drive`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to sync Google Drive');
    } finally {
      setConnections(prev => ({ ...prev, googleDrive: { ...prev.googleDrive, syncing: false } }));
    }
  };

  const handleSharePointConnect = async () => {
    try {
      window.location.href = '/api/storage/sharepoint/auth';
    } catch (error: any) {
      toast.error('Failed to initiate SharePoint connection');
    }
  };

  const handleSharePointSync = async () => {
    if (!connections.sharepoint.connected || !connections.sharepoint.siteUrl) {
      toast.error('Please connect to SharePoint and provide Site URL');
      return;
    }

    setConnections(prev => ({ ...prev, sharepoint: { ...prev.sharepoint, syncing: true } }));

    try {
      const response = await fetch('/api/storage/sharepoint/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteUrl: connections.sharepoint.siteUrl,
          libraryName: connections.sharepoint.libraryName || 'Documents',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sync failed');
      }

      toast.success(`Synced ${data.synced} documents from SharePoint`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to sync SharePoint');
    } finally {
      setConnections(prev => ({ ...prev, sharepoint: { ...prev.sharepoint, syncing: false } }));
    }
  };

  const handleFileServerConnect = async () => {
    if (!connections.fileServer.serverPath || !connections.fileServer.username || !connections.fileServer.password) {
      toast.error('Please provide server path, username, and password');
      return;
    }

    try {
      const response = await fetch('/api/storage/file-server/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverPath: connections.fileServer.serverPath,
          username: connections.fileServer.username,
          password: connections.fileServer.password,
          userId: currentUser?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Connection failed');
      }

      if (data.success) {
        setConnections(prev => ({
          ...prev,
          fileServer: {
            ...prev.fileServer,
            connected: true,
            connectionId: data.connectionId,
          },
        }));
        toast.success('File server connected successfully!');
      } else {
        toast.error(data.message || 'Connection test failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect to file server');
    }
  };

  const handleFileServerSync = async () => {
    if (!connections.fileServer.connected || !connections.fileServer.connectionId) {
      toast.error('Please connect to file server first');
      return;
    }

    setConnections(prev => ({ ...prev, fileServer: { ...prev.fileServer, syncing: true } }));

    try {
      const response = await fetch('/api/storage/file-server/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          connectionId: connections.fileServer.connectionId,
          folderPath: connections.fileServer.serverPath,
          userId: currentUser?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sync failed');
      }

      if (data.success) {
        toast.success(data.message || `Synced ${data.synced} documents from file server`);
      } else {
        toast.error(data.message || 'Sync completed with warnings');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sync file server');
    } finally {
      setConnections(prev => ({ ...prev, fileServer: { ...prev.fileServer, syncing: false } }));
    }
  };

  const handleDisconnect = (type: 'googleDrive' | 'sharepoint' | 'fileServer') => {
    setConnections(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        connected: false,
        ...(type === 'googleDrive' ? { folderId: '' } : {}),
        ...(type === 'sharepoint' ? { siteUrl: '', libraryName: '' } : {}),
        ...(type === 'fileServer' ? { serverPath: '', username: '', password: '', connectionId: '' } : {}),
      },
    }));
    toast.success(`${type === 'googleDrive' ? 'Google Drive' : type === 'sharepoint' ? 'SharePoint' : 'File Server'} disconnected`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">External Storage Connections</h2>
      <p className="text-gray-600 mb-6">Connect to external storage services to sync documents for RAG search.</p>

      <div className="space-y-6">
        {/* Google Drive */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Cloud className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Google Drive</h3>
                <p className="text-sm text-gray-600">Connect to sync documents from Google Drive</p>
              </div>
            </div>
            {connections.googleDrive.connected ? (
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Connected
              </span>
            ) : (
              <button
                onClick={handleGoogleDriveConnect}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Connect
              </button>
            )}
          </div>
          {connections.googleDrive.connected && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Folder ID (optional - leave empty for root)
                </label>
                <input
                  type="text"
                  value={connections.googleDrive.folderId}
                  onChange={(e) => setConnections(prev => ({
                    ...prev,
                    googleDrive: { ...prev.googleDrive, folderId: e.target.value },
                  }))}
                  placeholder="Enter Google Drive folder ID"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleGoogleDriveSync}
                  disabled={connections.googleDrive.syncing}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${connections.googleDrive.syncing ? 'animate-spin' : ''}`} />
                  {connections.googleDrive.syncing ? 'Syncing...' : 'Sync Documents'}
                </button>
                <button
                  onClick={() => handleDisconnect('googleDrive')}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SharePoint */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Folder className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">SharePoint</h3>
                <p className="text-sm text-gray-600">Connect to sync documents from SharePoint</p>
              </div>
            </div>
            {connections.sharepoint.connected ? (
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Connected
              </span>
            ) : (
              <button
                onClick={handleSharePointConnect}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                Connect
              </button>
            )}
          </div>
          {connections.sharepoint.connected && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Site URL *
                </label>
                <input
                  type="text"
                  value={connections.sharepoint.siteUrl}
                  onChange={(e) => setConnections(prev => ({
                    ...prev,
                    sharepoint: { ...prev.sharepoint, siteUrl: e.target.value },
                  }))}
                  placeholder="https://yourcompany.sharepoint.com/sites/..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Document Library Name
                </label>
                <input
                  type="text"
                  value={connections.sharepoint.libraryName}
                  onChange={(e) => setConnections(prev => ({
                    ...prev,
                    sharepoint: { ...prev.sharepoint, libraryName: e.target.value },
                  }))}
                  placeholder="Documents"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSharePointSync}
                  disabled={connections.sharepoint.syncing}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${connections.sharepoint.syncing ? 'animate-spin' : ''}`} />
                  {connections.sharepoint.syncing ? 'Syncing...' : 'Sync Documents'}
                </button>
                <button
                  onClick={() => handleDisconnect('sharepoint')}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>

        {/* File Server */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Server className="w-6 h-6 text-gray-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">File Server</h3>
                <p className="text-sm text-gray-600">Connect to network file server (SMB/CIFS)</p>
              </div>
            </div>
            {connections.fileServer.connected ? (
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Connected
              </span>
            ) : (
              <button
                onClick={handleFileServerConnect}
                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
              >
                Connect
              </button>
            )}
          </div>
          {!connections.fileServer.connected ? (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Server Path *
                </label>
                <input
                  type="text"
                  value={connections.fileServer.serverPath}
                  onChange={(e) => setConnections(prev => ({
                    ...prev,
                    fileServer: { ...prev.fileServer, serverPath: e.target.value },
                  }))}
                  placeholder="\\\\server\\share\\folder"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={connections.fileServer.username}
                  onChange={(e) => setConnections(prev => ({
                    ...prev,
                    fileServer: { ...prev.fileServer, username: e.target.value },
                  }))}
                  placeholder="Enter username"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={connections.fileServer.password}
                  onChange={(e) => setConnections(prev => ({
                    ...prev,
                    fileServer: { ...prev.fileServer, password: e.target.value },
                  }))}
                  placeholder="Enter password"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                />
              </div>
              <button
                onClick={handleFileServerConnect}
                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
              >
                Connect & Test
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  Connected to: {connections.fileServer.serverPath}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleFileServerSync}
                  disabled={connections.fileServer.syncing}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${connections.fileServer.syncing ? 'animate-spin' : ''}`} />
                  {connections.fileServer.syncing ? 'Syncing...' : 'Sync Documents'}
                </button>
                <button
                  onClick={() => handleDisconnect('fileServer')}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Note: File server sync requires server-side SMB/CIFS implementation. Install smb2 library for full functionality.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

