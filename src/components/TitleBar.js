// components/TitleBar.js

import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const TitleBar = () => {
    return (
        <>
            {/* <div style={{ display: 'flex',width: '100%' }}> */}
                <div style={{ background: '#007bff',color: 'white',padding: '0rem',textAlign: 'center' }}>
                    <img
                        alt=""
                        src="/OIG-removebg-preview.png"
                        width="40"
                        height="40"
                        className="d-inline-block align-top"
                    />{' '}
                    <h2>Pearl Medical</h2>
                </div>
                {/* You can add the company logo or any other content here */}

            {/* </div> */}
        </>
    );
};

export default TitleBar;
