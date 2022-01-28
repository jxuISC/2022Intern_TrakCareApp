'use strict';

import React, {Component, Fragment } from 'react';
import {
  Text,
  TouchableOpacity,
  Linking,
  View,
  StatusBar 
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import styles from './scanScreenStyle'

// to ignore Log Cycle msg
import { LogBox } from 'react-native'
LogBox.ignoreLogs([
    'Require cycle: node_modules'
])

// Jolyon suggested?
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; 

class ScanScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scan: false,
            ScanResult: false,
            result: null
        };
    }
  
  
    onSuccess = (e) => {
    // Linking.openURL(e.data).catch(err =>
    //   console.error('An error occured', err)
    // );
        const check = e.data.substring(0, 4);
        console.log('scanned data: ' + check);
        this.setState({
            result: e,
            scan: false,
            ScanResult: true
        })
        if (check === 'http') {
            Linking
                .openURL(e.data)
                .catch(err => console.error('An error occured', err));
        } 
        else {
            this.setState({
                result: e,
                scan: false,
                ScanResult: true
            })
        }      
    }

    activeQR = () => {
        this.setState({
            scan: true
        })
    }

    scanAgain = () => {
        this.setState({
            scan: true,
            ScanResult: false
        })
    }


    // Fetch API - still need to fix//
    fetchFunction = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic c3VwZXJ1c2VyOnBhc3N3b3Jk");

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("http://172.19.42.67:52773/tcfhir/trakr4/Patient/RN000000020?_format=json", requestOptions)
        .then(response => response.json())
        .then((responseJson) => {
            //Success
            alert(JSON.stringify(responseJson));
            console.log(responseJson);
          })
        .catch(error => console.log('error3', error))
        alert("Checking");
    }


    render() {
        const { scan, ScanResult, result } = this.state
        const desccription = 'QR code (abbreviated from Quick Response Code) is the trademark for a type of matrix barcode (or two-dimensional barcode) first designed in 1994 for the automotive industry in Japan. A barcode is a machine-readable optical label that contains information about the item to which it is attached.'
        
        return (
            <View style={styles.scrollViewStyle}>
                <Fragment>
                    <StatusBar barStyle="dark-content" />
                    <Text style={styles.textTitle}>123Welcome To QR Code-Barcode Feature !</Text>
                    
                    {!scan && !ScanResult &&
                        <View style={styles.cardView} >
                            <Text numberOfLines={8} style={styles.descText}>{desccription}</Text>

                            <TouchableOpacity onPress={this.activeQR} style={styles.buttonTouchable}>
                                <Text style={styles.buttonTextStyle}>Click to Scan !</Text>
                            </TouchableOpacity>

                            {/* // Fetch API - still need to fix//
                            <TouchableOpacity onPress={this.fetchFunction} style={styles.buttonTouchable}>
                                <Text style={styles.buttonTextStyle}>Toolkit Read Patient</Text>
                            </TouchableOpacity> */}

                        </View>
                    }

                    {ScanResult &&
                        <Fragment>
                            <Text style={styles.textTitle1}>Result !</Text>
                            <View style={ScanResult ? styles.scanCardView : styles.cardView}>
                                <Text>Type : {result.type}</Text>
                                <Text>Result : {result.data}</Text>
                                <Text numberOfLines={1}>RawData: {result.rawData}</Text>
                                <TouchableOpacity onPress={this.scanAgain} style={styles.buttonTouchable}>
                                    <Text style={styles.buttonTextStyle}>Click to Scan again!</Text>
                                </TouchableOpacity>
                            </View>
                        </Fragment>
                    }
                    
                    {scan &&
                        <QRCodeScanner
                            reactivate={true}
                            showMarker={true}
                            ref={(node) => { this.scanner = node }}
                            onRead={this.onSuccess}
                            topContent={
                                <Text style={styles.centerText}>
                                    Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code to test.</Text>
                            }
                            bottomContent={
                                <View>
                                    <TouchableOpacity style={styles.buttonTouchable} onPress={() => this.scanner.reactivate()}>
                                        <Text style={styles.buttonTextStyle}>OK. Got it!</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.buttonTouchable} onPress={() => this.setState({ scan: false })}>
                                        <Text style={styles.buttonTextStyle}>Stop Scan</Text>
                                    </TouchableOpacity>
                                </View>

                            }
                        />
                    }

                </Fragment>
            </View>

        );
    }
}

export default ScanScreen;

