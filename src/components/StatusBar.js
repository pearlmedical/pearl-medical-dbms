// components/StatusBar.js

import React from 'react';

const StatusBar = () => {
    return (
        <div style={{ background: '#f8f9fa',color: '#121213',padding: '5px',textAlign: 'center',position: 'fixed',bottom: 0,width: '100%' }}>
            {/* <div style={{ background: '#f8f9fa',color: '#121213',padding: '5px',textAlign: 'center',width: '100%' }}> */}
            <>&copy; 2024 Pearl Medical. All rights reserved.</>
        </div>
    );
};

export default StatusBar;
