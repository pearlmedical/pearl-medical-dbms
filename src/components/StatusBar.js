// components/StatusBar.js

import React from 'react';

const StatusBar = () => {
    return (
        <div style={{ background: '#f8f9fa',color: '#6c757d',padding: '10px',textAlign: 'center',position: 'fixed',bottom: 0,width: '100%' }}>
            <p>&copy; 2024 Pearl Medical. All rights reserved.</p>
        </div>
    );
};

export default StatusBar;
