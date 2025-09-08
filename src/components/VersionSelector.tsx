import React, { useState } from 'react';
import { Search, Download, Server, Zap, Shield, Wrench, Globe, Database, Code, Star, Users, Clock, ArrowRight, LogOut, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface ServerType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  bgGradient: string;
  versions: string[];
  category: 'minecraft' | 'proxy' | 'modded' | 'other';
  popularity: number;
  lastUpdate: string;
  features: string[];
}

interface VersionSelectorProps {
  serverId: string;
  serverName: string;
  apiKey: string;
  onLogout: () => void;
  onBackToServerSelect: () => void;
}

const serverTypes: ServerType[] = [
  {
    id: 'paper',
    name: 'Paper',
    description: 'High performance Minecraft server with advanced optimizations and plugin support',
    icon: <Server className="w-8 h-8" />,
    color: 'from-orange-400 to-red-500',
    gradient: 'bg-gradient-to-br from-orange-500/10 to-red-600/10',
    bgGradient: 'from-orange-500/20 via-red-500/20 to-pink-500/20',
    versions: ['1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.19.4', '1.19.3'],
    category: 'minecraft',
    popularity: 95,
    lastUpdate: '2 days ago',
    features: ['High Performance', 'Plugin Support', 'Anti-Cheat']
  },
  {
    id: 'neoforge',
    name: 'Neo Forge',
    description: 'Modern Minecraft modding platform forked from Forge with enhanced features',
    icon: <Zap className="w-8 h-8" />,
    color: 'from-yellow-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-yellow-500/10 to-orange-600/10',
    bgGradient: 'from-yellow-500/20 via-orange-500/20 to-red-500/20',
    versions: ['1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.19.4', '1.19.3'],
    category: 'modded',
    popularity: 88,
    lastUpdate: '1 week ago',
    features: ['Modern API', 'Enhanced Performance', 'Active Development']
  },
  {
    id: 'archlight',
    name: 'Archlight',
    description: 'High-performance Minecraft server software with advanced optimization features',
    icon: <Shield className="w-8 h-8" />,
    color: 'from-blue-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-purple-600/10',
    bgGradient: 'from-blue-500/20 via-purple-500/20 to-indigo-500/20',
    versions: ['1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.19.4'],
    category: 'minecraft',
    popularity: 75,
    lastUpdate: '3 days ago',
    features: ['High Performance', 'Optimized', 'Modern']
  },
  {
    id: 'forge',
    name: 'Forge',
    description: 'Powerful Minecraft modding platform with extensive mod compatibility',
    icon: <Wrench className="w-8 h-8" />,
    color: 'from-gray-500 to-yellow-500',
    gradient: 'bg-gradient-to-br from-gray-600/10 to-yellow-600/10',
    bgGradient: 'from-gray-600/20 via-yellow-600/20 to-orange-600/20',
    versions: ['1.20.4', '1.20.2', '1.19.4', '1.19.2', '1.18.2'],
    category: 'modded',
    popularity: 92,
    lastUpdate: '5 days ago',
    features: ['Mod Support', 'Advanced API', 'Large Community']
  },
  {
    id: 'fabric',
    name: 'Fabric',
    description: 'Lightweight and fast modding toolchain for modern Minecraft versions',
    icon: <Code className="w-8 h-8" />,
    color: 'from-green-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-green-500/10 to-blue-600/10',
    bgGradient: 'from-green-500/20 via-blue-500/20 to-cyan-500/20',
    versions: ['1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.19.4'],
    category: 'modded',
    popularity: 85,
    lastUpdate: '1 day ago',
    features: ['Fast Loading', 'Modern', 'Lightweight']
  },
  {
    id: 'velocity',
    name: 'Velocity',
    description: 'Next-generation Minecraft proxy with superior performance and security',
    icon: <Globe className="w-8 h-8" />,
    color: 'from-cyan-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-500/10 to-blue-600/10',
    bgGradient: 'from-cyan-500/20 via-blue-500/20 to-indigo-500/20',
    versions: ['3.2.0', '3.1.2', '3.1.1', '3.0.1'],
    category: 'proxy',
    popularity: 78,
    lastUpdate: '1 week ago',
    features: ['High Performance', 'Security', 'Modern']
  },
  {
    id: 'purpur',
    name: 'Purpur',
    description: 'Feature-rich Paper fork with extensive customization and performance improvements',
    icon: <Database className="w-8 h-8" />,
    color: 'from-purple-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-400/10 to-pink-600/10',
    bgGradient: 'from-purple-400/20 via-pink-500/20 to-rose-500/20',
    versions: ['1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.19.4'],
    category: 'minecraft',
    popularity: 82,
    lastUpdate: '4 days ago',
    features: ['Customizable', 'High Performance', 'Feature-Rich']
  },
  {
    id: 'mohist',
    name: 'Mohist',
    description: 'Hybrid Minecraft server combining Forge mods with Bukkit plugins',
    icon: <Shield className="w-8 h-8" />,
    color: 'from-purple-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-500/10 to-pink-600/10',
    bgGradient: 'from-purple-500/20 via-pink-500/20 to-rose-500/20',
    versions: ['1.20.2', '1.20.1', '1.19.4', '1.19.2', '1.18.2', '1.16.5', '1.12.2', '1.7.10'],
    category: 'modded',
    popularity: 65,
    lastUpdate: '4 days ago',
    features: ['Forge + Bukkit', 'Hybrid', 'Versatile']
  }
];

// Download URL mapping for different server types and versions
const downloadUrls: Record<string, Record<string, string>> = {
  mohist: {
    '1.20.2': 'https://s3.mcjars.app/mohist/1.20.2/1.20.2-1b280342/server.jar',
    '1.20.1': 'https://s3.mcjars.app/mohist/1.20.1/1.20.1-b562929a/server.jar',
    '1.19.4': 'https://s3.mcjars.app/mohist/1.19.4/1.19.4-c1f9ddbf/server.jar',
    '1.19.2': 'https://s3.mcjars.app/mohist/1.19.2/1.19.2-acf34325/server.jar',
    '1.18.2': 'https://s3.mcjars.app/mohist/1.18.2/1.18.2-ffc4df93/server.jar',
    '1.16.5': 'https://s3.mcjars.app/mohist/1.16.5/1.16.5-044418da/server.jar',
    '1.12.2': 'https://s3.mcjars.app/mohist/1.12.2/1.12.2-2bfa4f6d/server.jar',
    '1.7.10': 'https://s3.mcjars.app/mohist/1.7.10/1.7.10-de68ad73/server.jar'
  }
  // Add more server types and their download URLs here as needed
};

const categories = [
  { id: 'all', name: 'All Servers', icon: <Server className="w-4 h-4" />, count: serverTypes.length },
  { id: 'minecraft', name: 'Minecraft', icon: <Server className="w-4 h-4" />, count: serverTypes.filter(s => s.category === 'minecraft').length },
  { id: 'modded', name: 'Modded', icon: <Wrench className="w-4 h-4" />, count: serverTypes.filter(s => s.category === 'modded').length },
  { id: 'proxy', name: 'Proxy', icon: <Globe className="w-4 h-4" />, count: serverTypes.filter(s => s.category === 'proxy').length },
  { id: 'other', name: 'Other', icon: <Database className="w-4 h-4" />, count: serverTypes.filter(s => s.category === 'other').length }
];

export default function VersionSelector({ serverId, serverName, apiKey, onLogout, onBackToServerSelect }: VersionSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedServer, setSelectedServer] = useState<ServerType | null>(null);
  const [installingVersion, setInstallingVersion] = useState<string | null>(null);
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'success' | 'error'>('idle');
  const [installMessage, setInstallMessage] = useState('');

  const filteredServers = serverTypes.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         server.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || server.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => b.popularity - a.popularity);

  const installVersion = async (serverType: string, version: string) => {
    const downloadUrl = downloadUrls[serverType]?.[version];
    
    if (!downloadUrl) {
      setInstallStatus('error');
      setInstallMessage(`Download URL not found for ${serverType} ${version}`);
      return;
    }

    setInstallingVersion(`${serverType}-${version}`);
    setInstallStatus('installing');
    setInstallMessage(`Installing ${serverType} ${version}...`);

    try {
      const response = await fetch(`https://console.exluhost.my.id/api/client/servers/${serverId}/files/pull`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'Application/vnd.pterodactyl.v1+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: downloadUrl,
          directory: '/',
          filename: 'server.jar'
        })
      });

      if (response.ok) {
        // Simulate 30 second installation time
        setTimeout(() => {
          setInstallStatus('success');
          setInstallMessage(`${serverType} ${version} installed successfully!`);
          setInstallingVersion(null);
          
          // Clear success message after 5 seconds
          setTimeout(() => {
            setInstallStatus('idle');
            setInstallMessage('');
          }, 5000);
        }, 30000);
      } else {
        throw new Error(`Installation failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Installation error:', error);
      setInstallStatus('error');
      setInstallMessage(`Installation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setInstallingVersion(null);
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setInstallStatus('idle');
        setInstallMessage('');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Server className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    Version Manager
                  </h1>
                  <p className="text-slate-400 text-lg">Managing: <span className="text-blue-400 font-semibold">{serverName}</span></p>
                  <p className="text-slate-500 text-sm">Server ID: <span className="font-mono">{serverId}</span></p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search servers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm w-full sm:w-80 transition-all"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{filteredServers.length} servers available</span>
                </div>
                <button
                  onClick={onBackToServerSelect}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-500/50 rounded-lg text-slate-300 hover:text-white transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-500/50 rounded-lg text-slate-300 hover:text-white transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Install Status Notification */}
        {installStatus !== 'idle' && (
          <div className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
            installStatus === 'installing' 
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-100'
              : installStatus === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-100'
              : 'bg-red-500/10 border-red-500/30 text-red-100'
          }`}>
            <div className="flex items-center space-x-3">
              {installStatus === 'installing' && (
                <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
              )}
              {installStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
              {installStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
              <span className="font-medium">{installMessage}</span>
            </div>
          </div>
        )}
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`group flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 backdrop-blur-sm'
              }`}
            >
              <div className={`transition-transform duration-300 ${selectedCategory === category.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {category.icon}
              </div>
              <span>{category.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                selectedCategory === category.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Server Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServers.map((server, index) => (
            <div
              key={server.id}
              onClick={() => setSelectedServer(server)}
              className={`group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 ${server.gradient} border border-slate-700/50 hover:border-slate-600/50 backdrop-blur-sm`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${server.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Content */}
              <div className="relative p-6 bg-slate-800/50 backdrop-blur-sm h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${server.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {server.icon}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-slate-300">{server.popularity}</span>
                  </div>
                </div>
                
                {/* Title & Description */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors">
                    {server.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                    {server.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {server.features.slice(0, 2).map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md border border-slate-600/50"
                    >
                      {feature}
                    </span>
                  ))}
                  {server.features.length > 2 && (
                    <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-md border border-slate-600/50">
                      +{server.features.length - 2}
                    </span>
                  )}
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{server.lastUpdate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{server.versions.length} versions</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
              
              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {filteredServers.length === 0 && (
          <div className="text-center py-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
              <Server className="relative w-20 h-20 text-slate-600 mx-auto mb-6" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-400 mb-3">No servers found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Try adjusting your search terms or category filter to find the perfect server software for your needs.
            </p>
          </div>
        )}
      </div>

      {/* Version Selection Modal */}
      {selectedServer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden border border-slate-700/50 shadow-2xl">
            {/* Modal Header */}
            <div className={`p-6 bg-gradient-to-r ${selectedServer.bgGradient} border-b border-slate-700/50`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${selectedServer.color} shadow-lg`}>
                    <div className="text-white">
                      {selectedServer.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedServer.name}</h3>
                    <p className="text-slate-300 text-sm">{selectedServer.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-slate-300">{selectedServer.popularity}% popularity</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-400">{selectedServer.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedServer(null)}
                  className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800/50 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Features */}
            <div className="p-6 border-b border-slate-700/50">
              <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
              <div className="flex flex-wrap gap-2">
                {selectedServer.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1 bg-slate-800/50 text-slate-300 text-sm rounded-lg border border-slate-700/50"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Versions */}
            <div className="p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Available Versions</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedServer.versions.map((version, index) => {
                  const isInstalling = installingVersion === `${selectedServer.id}-${version}`;
                  const hasDownloadUrl = downloadUrls[selectedServer.id]?.[version];
                  const isDisabled = installStatus === 'installing' || !hasDownloadUrl;
                  
                  return (
                    <button
                      key={version}
                      onClick={() => hasDownloadUrl && !isDisabled && installVersion(selectedServer.id, version)}
                      disabled={isDisabled}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 group border ${
                        isDisabled 
                          ? 'bg-slate-800/30 border-slate-700/30 cursor-not-allowed opacity-50'
                          : 'bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50 hover:border-slate-600/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${selectedServer.color}`}></div>
                        <span className="text-white font-medium">{version}</span>
                        {index === 0 && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-md border border-green-500/30">
                            Latest
                          </span>
                        )}
                        {!hasDownloadUrl && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-md border border-yellow-500/30">
                            Not Available
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {isInstalling ? (
                          <>
                            <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                            <span className="text-blue-400 text-sm">Installing...</span>
                          </>
                        ) : (
                          <>
                            <span className={`text-sm transition-colors ${
                              isDisabled ? 'text-slate-500' : 'text-slate-400 group-hover:text-slate-300'
                            }`}>
                              {hasDownloadUrl ? 'Install' : 'Unavailable'}
                            </span>
                            <Download className={`w-4 h-4 transition-colors ${
                              isDisabled ? 'text-slate-500' : 'text-slate-400 group-hover:text-white'
                            }`} />
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
