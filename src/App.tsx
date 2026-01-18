import React, { useState } from 'react';
import { Plus, Check, Trash2, Moon, Sun, Calendar as CalIcon, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomiesMyDay() {
  // --- STATE ---
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar"); // 'calendar' or 'global'
  
  // Calendar State
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today); // Tracks which month we are looking at
  const [selectedDate, setSelectedDate] = useState(today); // Tracks which specific day you clicked

  // Task State
  const [tasks, setTasks] = useState([
    { id: 1, text: "Finish the app upgrade", priority: "High", completed: false, date: today.toDateString(), type: 'daily' },
    { id: 2, text: "Become a React Pro", priority: "High", completed: false, date: "", type: 'global' },
  ]);
  
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Low");

  // --- CALENDAR LOGIC ---
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleDayClick = (day) => {
    // Create a date object for the day clicked in the CURRENTLY VIEWED month
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  // NEW: Time Travel Functions
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // --- TASK MANAGERS ---
  const addTask = () => {
    if (!newTask.trim()) return;
    
    const taskType = activeTab === 'global' ? 'global' : 'daily';
    const taskDate = activeTab === 'global' ? '2026' : selectedDate.toDateString();

    setTasks([...tasks, { 
      id: Date.now(), 
      text: newTask, 
      priority, 
      completed: false,
      date: taskDate,
      type: taskType
    }]);
    setNewTask("");
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'global') return task.type === 'global';
    return task.type === 'daily' && task.date === selectedDate.toDateString();
  });

  // --- STYLES ---
  const getPriorityColor = (p) => {
    switch(p) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const bgMain = isDarkMode ? 'bg-[#191919]' : 'bg-[#F7F7F5]';
  const bgCard = isDarkMode ? 'bg-[#202020] border-[#2A2A2A]' : 'bg-white border-gray-200';
  const textColor = isDarkMode ? 'text-[#D4D4D4]' : 'text-[#37352F]';
  const inputBg = isDarkMode ? 'bg-[#2A2A2A] text-white border-gray-700 focus:border-gray-500' : 'bg-gray-50 text-black border-gray-200 focus:border-black';

  return (
    <div className={`min-h-screen ${bgMain} ${textColor} font-sans flex flex-col items-center py-8 transition-colors duration-300`}>
      
      <div className={`w-full max-w-md ${bgCard} shadow-xl border rounded-2xl overflow-hidden min-h-[700px] flex flex-col transition-colors duration-300`}>
        
        {/* --- HEADER --- */}
        <div className="h-44 bg-gradient-to-br from-indigo-500 to-purple-700 relative p-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 p-2 rounded-full text-white backdrop-blur-md transition">
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="absolute bottom-2 right-4 text-xs text-white/60 font-mono">v2.1 Time Traveler</div>
        </div>

        {/* --- PROFILE SECTION --- */}
        <div className="px-6 relative mb-4">
          <div className="absolute -top-16 left-6">
            <div className={`w-23 h-32 rounded-full border-4 ${isDarkMode ? 'border-[#202020]' : 'border-white'} shadow-lg overflow-hidden bg-gray-300`}>
                {/* ⚠️ CHECK YOUR IMAGE NAME HERE: .png vs .PNG */}
                <img src="/my-face.PNG" alt="My Face" className="w-full h-full object-cover"/>
            </div>
          </div>
          <div className="mt-16 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Homies Dashboard</h1>
              <p className="text-gray-500 text-xs">
                Planning: <span className="font-semibold">{activeTab === 'global' ? 'Global Vision' : selectedDate.toDateString()}</span>
              </p>
            </div>
          </div>
        </div>

        {/* --- TABS --- */}
        <div className="flex px-6 gap-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-2">
            <button 
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center gap-2 pb-2 text-sm font-medium transition ${activeTab === 'calendar' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-gray-400 hover:text-gray-500'}`}
            >
                <CalIcon size={16} /> Monthly
            </button>
            <button 
                onClick={() => setActiveTab('global')}
                className={`flex items-center gap-2 pb-2 text-sm font-medium transition ${activeTab === 'global' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-gray-400 hover:text-gray-500'}`}
            >
                <Globe size={16} /> Global Goals
            </button>
        </div>

        {/* --- CALENDAR GRID (With Navigation) --- */}
        {activeTab === 'calendar' && (
            <div className="px-6 mb-6">
                
                {/* NEW: Navigation Header */}
                <div className="flex justify-between items-center mb-4">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                        <ChevronLeft size={20} />
                    </button>
                    
                    <span className="font-bold text-lg select-none">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>

                    <button onClick={nextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-7 text-center mb-2">
                    {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-[10px] text-gray-400 font-bold">{d}</div>)}
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-sm">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
                    
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        
                        // Check if this specific day is the one currently selected
                        const isSelected = 
                            selectedDate.getDate() === day && 
                            selectedDate.getMonth() === currentDate.getMonth() &&
                            selectedDate.getFullYear() === currentDate.getFullYear();
                        
                        // Check if this specific day is strictly "Today" (Real life today)
                        const isToday = 
                            today.getDate() === day && 
                            today.getMonth() === currentDate.getMonth() && 
                            today.getFullYear() === currentDate.getFullYear();
                        
                        return (
                            <button 
                                key={day} 
                                onClick={() => handleDayClick(day)}
                                className={`h-8 w-8 rounded-full flex items-center justify-center transition text-xs
                                    ${isSelected ? 'bg-indigo-600 text-white shadow-md scale-110' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
                                    ${isToday && !isSelected ? 'border border-indigo-500 text-indigo-500 font-bold' : ''}
                                `}
                            >
                                {day}
                            </button>
                        )
                    })}
                </div>
            </div>
        )}

        {/* --- INPUT AREA --- */}
        <div className="px-6 mb-4">
            <div className="flex gap-2 mb-2">
                <input 
                    type="text" 
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder={activeTab === 'global' ? "Add a big goal..." : `Plan for ${selectedDate.toLocaleDateString()}...`}
                    className={`flex-1 border-b-2 outline-none px-2 py-2 text-sm transition-colors ${inputBg}`}
                />
                <button onClick={addTask} className="bg-indigo-600 text-white rounded-lg px-3 hover:bg-indigo-700 transition">
                    <Plus size={20} />
                </button>
            </div>
            <div className="flex gap-2">
                {['Low', 'Medium', 'High'].map(p => (
                    <button key={p} onClick={() => setPriority(p)} className={`text-[10px] uppercase font-bold px-2 py-1 rounded border transition ${priority === p ? getPriorityColor(p) : 'border-transparent text-gray-400'}`}>
                        {p}
                    </button>
                ))}
            </div>
        </div>

        {/* --- TASK LIST --- */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {activeTab === 'global' ? 'Global Vision List' : 'Daily Tasks'}
            </h3>

            {filteredTasks.length === 0 && (
                <div className="text-center py-10 opacity-50">
                    <p className="text-sm">No plans for this date.</p>
                </div>
            )}
            
            {filteredTasks.map(task => (
                <div key={task.id} className={`group flex items-center gap-3 py-3 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-50'} transition`}>
                    <button 
                        onClick={() => toggleComplete(task.id)}
                        className={`w-5 h-5 border rounded-full flex items-center justify-center transition ${task.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-400 text-transparent'}`}
                    >
                        <Check size={12} strokeWidth={3} />
                    </button>
                    
                    <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.text}
                    </span>

                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                    </span>
                    
                    <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}