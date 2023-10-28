import React, { useState, useEffect, createContext } from 'react';

import { ethers } from "ethers";
import { polygonMumbai } from "wagmi/chains"
import { WALLET_ADAPTERS, CHAIN_NAMESPACES } from "@web3auth/base";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

import { signInWithGoogle, storeUserDetails, getUserDetails } from './firebase';


const AuthContext = createContext();

export default function AuthHolder(props) {

    const [web3auth, setWeb3auth] = useState(null)
    const [user, setUser] = useState(null)
    const [address, setAddress] = useState(null)
    const [connected, setConnected] = useState(false)

    const signInHandler = async (role) => {
        const loginRes = await signInWithGoogle();
        const idToken = await loginRes.user.getIdToken(true);

        await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
            loginProvider: "jwt",
            extraLoginOptions: {
                id_token: idToken,
                verifierIdField: "sub",
            },
        });

        const provider = new ethers.BrowserProvider(web3auth.provider)
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const user = await web3auth.getUserInfo();

        await storeUserDetails(user, address, role)

        setUser({ ...user, address, role, pastOrders: [] })
        setAddress(address)
        setConnected(true);
    }

    const logoutHandler = async () => {
        await web3auth.logout();
        setConnected(false);
        setAddress(null);
        setUser(null);
    }

    useEffect(() => {
        (async () => {
            const clientId = process.env.REACT_APP_CLIENT_ID;

            const chainConfig = {
                chainNamespace: CHAIN_NAMESPACES.EIP155,
                chainId: "0x" + polygonMumbai.id.toString(16),
                rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
                displayName: polygonMumbai.name,
                tickerName: polygonMumbai.nativeCurrency?.name,
                ticker: polygonMumbai.nativeCurrency?.symbol,
                blockExplorer: polygonMumbai.blockExplorers?.default.url[0],
            };

            const web3auth = new Web3AuthNoModal({
                clientId,
                web3AuthNetwork: "sapphire_devnet",
                chainConfig,
            });

            const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

            const openloginAdapter = new OpenloginAdapter({
                adapterSettings: {
                    uxMode: "redirect",
                    loginConfig: {
                        jwt: {
                            verifier: "irctc-firebase",
                            typeOfLogin: "jwt",
                            clientId,
                        },
                    },
                },
                loginSettings: {
                    mfaLevel: "none"
                },
                privateKeyProvider,
            });

            web3auth.configureAdapter(openloginAdapter);
            setWeb3auth(web3auth)
            await web3auth.init()

            if (web3auth.connected) {
                const user = await web3auth.getUserInfo();
                const userDetails = await getUserDetails(user.verifierId)

                const provider = new ethers.BrowserProvider(web3auth.provider)
                const signer = await provider.getSigner();
                const address = await signer.getAddress();

                setAddress(address)
                setUser(userDetails)
                setConnected(true);
            }
        })();
    }, [])

    return (
        <AuthContext.Provider value={{
            address, setAddress, connected, setConnected, web3auth, setWeb3auth,
            user, setUser, signInHandler, logoutHandler
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthContext };