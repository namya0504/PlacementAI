import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, CheckCircle, Circle, BookOpen, X, Star } from 'lucide-react';

export default function TopicSelector({ topics = [], selectedTopicId, onSelectTopic }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const activeTopic = topics.find(t => t.topicId === selectedTopicId) || topics[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredTopics = topics.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative inline-block w-full max-w-md" ref={dropdownRef}>
      {/* Selected Topic Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:border-purple-400 dark:hover:border-purple-600 transition-all text-left focus:outline-none focus:ring-2 focus:ring-purple-500/30"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold text-xs shrink-0">
            {activeTopic?.order || 1}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Topic</span>
              {activeTopic?.hasStarBadge && (
                <span className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" /> Star
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {activeTopic?.title || 'Select Topic'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {typeof activeTopic?.solvedCount === 'number' && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100/70 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              {activeTopic.solvedCount} / 20
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/50">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 21 DSA Topics..."
              className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Learning Order Note */}
          <div className="px-4 py-2 bg-purple-50/40 dark:bg-purple-950/20 text-[11px] text-purple-700 dark:text-purple-300 font-medium border-b border-purple-100/50 dark:border-purple-900/30 flex items-center justify-between">
            <span>Recommended Learning Order</span>
            <span>{topics.length} Topics</span>
          </div>

          {/* Topic List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
            {filteredTopics.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No topics matching "{searchTerm}"
              </div>
            ) : (
              filteredTopics.map((topic) => {
                const isSelected = topic.topicId === selectedTopicId;
                const solved = topic.solvedCount || 0;
                const total = topic.problemCount || 15;

                return (
                  <button
                    key={topic.topicId}
                    type="button"
                    onClick={() => {
                      onSelectTopic(topic.topicId);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {topic.order}
                      </span>
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-sm truncate">
                          {topic.title}
                        </span>
                        {topic.hasStarBadge && (
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {solved > 0 ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle className="w-3 h-3" />
                          {solved} / 20
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          20 problems
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

