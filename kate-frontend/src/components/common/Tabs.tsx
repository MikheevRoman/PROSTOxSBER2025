import React from 'react';
import './Tabs.css';

interface TabsProps {
    tabs: { id: string; label: string }[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const Tabs = (props: TabsProps) => {
  return (
    <div className="tabs-container">
      <div className="tabs">
        {props.tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${props.activeTab === tab.id ? 'active' : ''}`}
            onClick={() => props.onTabChange(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs; 