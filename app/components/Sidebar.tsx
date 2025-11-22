"use client";

import { useState, useRef, useEffect } from "react";
import {
  Languages,
  Mic,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Plus,
  MessageSquare,
  Trash2,
  Calendar,
  Search,
  LogOut,
  User,
  Command,
} from "lucide-react";

interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  category: "main" | "bottom";
}

interface TranslationHistory {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  date: string;
}

const mainTabs: TabItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, category: "main" },
  { id: "translate", label: "New Translation", icon: Plus, category: "main" },
  { id: "audio", label: "Audio", icon: Mic, category: "main" },
  { id: "users", label: "Users", icon: Users, category: "main" },
];

const bottomTabs: TabItem[] = [
  { id: "settings", label: "Settings", icon: Settings, category: "bottom" },
];

const mockHistory: TranslationHistory[] = [
  { id: "1", title: "Business Meeting", preview: "Hello, nice to meet you...", timestamp: "10:30 AM", date: "Today" },
  { id: "2", title: "Restaurant Order", preview: "I would like to order...", timestamp: "Yesterday", date: "Yesterday" },
  { id: "3", title: "Travel Directions", preview: "How do I get to the...", timestamp: "9:15 AM", date: "Nov 12" },
  { id: "4", title: "Technical Support", preview: "My device is not working...", timestamp: "2:45 PM", date: "Nov 10" },
  { id: "5", title: "Shopping List", preview: "I need to buy groceries...", timestamp: "11:20 AM", date: "Nov 8" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("translate");
  const [clickedTab, setClickedTab] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isMobile, setIsMobile] = useState(false);
  const [history] = useState<TranslationHistory[]>(mockHistory);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = Math.max(200, Math.min(400, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => {
    if (isMobile && isCollapsed) {
      // On mobile, show full sidebar when clicking the arrow
      setIsCollapsed(false);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setClickedTab(tabId);
    
    setTimeout(() => {
      setClickedTab(null);
    }, 200);

    // Auto-collapse on mobile after selection
    if (isMobile) {
      setTimeout(() => setIsCollapsed(true), 300);
    }
  };

  const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => (
    <div className="relative group">
      {children}
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {text}
      </div>
    </div>
  );

  const TabButton = ({ tab }: { tab: TabItem }) => (
    <Tooltip text={tab.label}>
      <button
        onClick={() => handleTabClick(tab.id)}
        className={`
          flex items-center w-full p-3 rounded-lg text-sm font-medium transition-all duration-200
          ${
            activeTab === tab.id
              ? "bg-neutral-700 text-white"
              : "text-gray-400 hover:bg-[#8F8FFF] hover:text-white hover:bg-opacity-20"
          }
          ${
            clickedTab === tab.id
              ? "bg-[#8F8FFF] bg-opacity-30 text-white scale-95"
              : ""
          }
          ${isCollapsed ? "justify-center" : ""}
        `}
      >
        <tab.icon 
          size={20} 
          className={!isCollapsed ? "mr-3 transition-all duration-300" : "transition-all duration-300"} 
        />
        {!isCollapsed && <span className="truncate transition-all duration-300">{tab.label}</span>}
      </button>
    </Tooltip>
  );

  // Fixed HistoryItem component without nested buttons
  const HistoryItem = ({ item }: { item: TranslationHistory }) => (
    <div className="group relative">
      <div
        className="flex items-start w-full p-3 rounded-lg hover:bg-neutral-700 transition-all duration-200 cursor-pointer"
        onClick={() => handleTabClick(`history-${item.id}`)}
      >
        <MessageSquare size={16} className="text-gray-400 mt-0.5 mr-3 flex-shrink-0 transition-all duration-300" />
        {!isCollapsed && (
          <>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{item.title}</div>
              <div className="text-gray-400 text-xs truncate mt-1">{item.preview}</div>
            </div>
            <button 
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-neutral-600 rounded transition-all duration-200 ml-2 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                // Handle delete
                console.log('Delete item:', item.id);
              }}
            >
              <Trash2 size={14} className="text-gray-400 transition-all duration-300" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  const CommandPalette = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-[#1F1F1F] border border-neutral-800 rounded-lg w-full max-w-2xl mx-4">
        <div className="flex items-center p-4 border-b border-neutral-800">
          <Search size={20} className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Type a command or search..."
            className="bg-transparent text-white placeholder-gray-400 flex-1 focus:outline-none"
            autoFocus
          />
          <div className="flex items-center space-x-2 text-xs text-gray-400 ml-4">
            <kbd className="px-2 py-1 bg-neutral-800 rounded">Esc</kbd>
            <span>to close</span>
          </div>
        </div>
        <div className="p-2 max-h-96 overflow-y-auto">
          {/* Command items would go here */}
          <div className="p-3 hover:bg-neutral-800 rounded cursor-pointer">
            <div className="text-white">New Translation</div>
            <div className="text-gray-400 text-sm">Start a new translation session</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating New Translation Button */}
      {isCollapsed && (
        <button
          onClick={() => handleTabClick("translate")}
          className="fixed bottom-6 left-6 w-14 h-14 bg-[#8F8FFF] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-300 z-40"
        >
          <Plus size={24} className="text-black" />
        </button>
      )}

      {/* Command Palette */}
      {showCommandPalette && <CommandPalette />}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          flex flex-col h-screen bg-[#1F1F1F] border-r border-neutral-800 text-white transition-all duration-300 ease-in-out relative
          ${isCollapsed ? "w-20" : ""}
          ${isMobile && isCollapsed ? "w-0" : ""}
        `}
        style={!isCollapsed ? { width: `${sidebarWidth}px` } : {}}
      >
        {/* Resize Handle */}
        {!isCollapsed && (
          <div
            className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-10"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
            }}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Languages size={24} className="text-[#8F8FFF]" />
              <span className="text-lg font-semibold">X-Translator</span>
            </div>
          )}
          <Tooltip text={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-neutral-800 transition-all duration-300 rounded-lg"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </Tooltip>
        </div>

        {/* Command Palette Trigger */}
        {!isCollapsed && (
          <div className="p-3">
            <button
              onClick={() => setShowCommandPalette(true)}
              className="flex items-center w-full p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-all duration-200 text-gray-400 hover:text-white"
            >
              <Search size={16} className="mr-3" />
              <span className="flex-1 text-left">Search commands...</span>
              <div className="flex items-center space-x-1 text-xs">
                <kbd className="px-1.5 py-1 bg-neutral-700 rounded">Ctrl</kbd>
                <kbd className="px-1.5 py-1 bg-neutral-700 rounded">K</kbd>
              </div>
            </button>
          </div>
        )}

        {/* New Chat/Translation Button */}
        {!isCollapsed && (
          <div className="p-3 border-b border-neutral-800">
            <button
              onClick={() => handleTabClick("translate")}
              className="flex items-center justify-center w-full p-3 border border-neutral-600 rounded-lg hover:bg-neutral-800 transition-all duration-200 group"
            >
              <Plus size={18} className="mr-2 transition-all duration-300" />
              <span>New Translation</span>
            </button>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="p-3 space-y-1">
          {mainTabs.map((tab) => (
            <TabButton key={tab.id} tab={tab} />
          ))}
        </nav>

        {/* History Section */}
        {!isCollapsed && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-3 pt-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center text-gray-400 hover:text-white transition-all duration-200"
              >
                <Calendar size={16} className="mr-2 transition-all duration-300" />
                <span className="text-sm font-medium">History</span>
              </button>
            </div>

            {showHistory && (
              <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
                {history.map((item) => (
                  <HistoryItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Section */}
        <div className="border-t border-neutral-800 p-3 space-y-2">
          {/* Settings */}
          {bottomTabs.map((tab) => (
            <TabButton key={tab.id} tab={tab} />
          ))}
          
          {/* User Profile */}
          {!isCollapsed ? (
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-800 transition-all duration-200 group">
              <div className="flex items-center flex-1">
                <div className="w-8 h-8 rounded-full bg-[#8F8FFF] flex items-center justify-center mr-3">
                  <User size={16} className="text-black" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white text-sm font-medium">User Name</div>
                  <div className="text-gray-400 text-xs">Free Plan</div>
                </div>
              </div>
              <Tooltip text="Logout">
                <button className="p-2 hover:bg-neutral-700 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                  <LogOut size={16} className="text-gray-400" />
                </button>
              </Tooltip>
            </div>
          ) : (
            <Tooltip text="User Profile">
              <button className="flex items-center justify-center w-full p-3 rounded-lg hover:bg-neutral-800 transition-all duration-200">
                <User size={20} />
              </button>
            </Tooltip>
          )}
        </div>

        {/* Resize Handle Visual Indicator */}
        {!isCollapsed && (
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-16 bg-neutral-600 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200" />
        )}
      </div>
    </>
  );
}