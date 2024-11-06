import React from 'react'
import { Button } from 'antd'
import axios from 'axios'

function Tester() {

    async function click() {
        console.log(window.location.hostname)
        getPublicIP().then(ip => console.log(ip))
        console.log(getBrowserInfo())
        getLocation(
            (position) => {
                console.log({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            },
            (err) => setError(err.message)
        );
        getLocalIP()
        getJson()
    }

    async function getPublicIP() {
        return fetch('https://api.ipify.org?format=json')
            .then((response) => response.json())
            .catch((error) => console.error('Error fetching public IP:', error));
    }

    function getBrowserInfo() {
        return {
            appName: navigator.appName,       // Browser name
            appVersion: navigator.appVersion, // Browser version
            platform: navigator.platform,     // OS platform (e.g., Win32, MacIntel)
            userAgent: navigator.userAgent,   // Full user-agent string (can parse for OS, browser)
            language: navigator.language,     // Browser language
        };
    }

    function getLocation(successCallback, errorCallback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        } else {
            errorCallback(new Error("Geolocation not supported"));
        }
    }

    const getLocalIP = async () => {
        try {
            const pc = new RTCPeerConnection({ iceServers: [] });
            pc.createDataChannel('');
            pc.createOffer()
                .then(offer => pc.setLocalDescription(offer))
                .catch(error => console.error('Error creating offer', error));

            pc.onicecandidate = event => {
                if (!event || !event.candidate) return;
                const candidate = event.candidate.candidate;
                const localIPMatch = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
                if (localIPMatch) {
                    console.log(localIPMatch[1])
                    pc.close();
                }
            };
        } catch (error) {
            console.error('Error getting local IP:', error);
        }
    };

    async function getJson() {
      
        
    }

    return (
        <div>
            <Button onClick={() => { click() }}>TEST</Button>
        </div>
    )
}

export default Tester