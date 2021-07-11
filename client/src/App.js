import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import './css/main.css';

// import pages
import Home from './views/Home';
import Header from './components/layout/Header';
import JobForms from './views/JobForm';
import BrowseGrid from './components/search/BrowseGrid';
import Dashboard from './components/dashboard/Dashboard';
import Footer from './components/layout/Footer'
import SignUpForm from './components/SignUpForm'
import FreelancerDashboard from './components/dashboard/FreelancerDashboard';

import CeramicClient from '@ceramicnetwork/http-client';
import { ThreeIdConnect,  EthereumAuthProvider } from '@3id/connect';
import KeyDidResolver from 'key-did-resolver'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import { DID } from 'dids';
import Web3 from 'web3';

// import provider detector
import detectEthereumProvider from '@metamask/detect-provider';

// import contract abis
import Escrow from './build/contracts/Escrow.json'
import EscrowDisputeManager from './build/contracts/EscrowDisputeManager.json'
import ContractForm from './components/ContractForm';

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [did, setDid] = useState('');
  const [ethereum, setEthereum] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [ceramic, setCeramic] = useState(null);

  const [escrowContract, setEscrowContract] = useState(null);
  const [escrowDisputeManager, setEscrowDisputeManager] = useState(null);

  // set ceramic
  useEffect(() => {
    const API_URL = 'https://ceramic-clay.3boxlabs.com';
    const ceramic = new CeramicClient(API_URL);
    const resolver = { ...KeyDidResolver.getResolver(), ...ThreeIdResolver.getResolver(ceramic) };
    const did = new DID({ resolver });
    ceramic.setDID(did);
    setCeramic(ceramic);
  }, [setCeramic]);

  // set ethereum object
  useEffect(() => {
    const detectProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        setEthereum(provider);
      }
    }

    detectProvider();
  }, [setEthereum]);

  // set web3
  useEffect(() => {
    const web3 = new Web3(ethereum);
    setWeb3(web3);
  }, [setWeb3]);

  useEffect(() => {
    const authenticateDID = async () => {
      // request authentication from user's blockchain wallet
      const threeIdConnect = new ThreeIdConnect();
      const authProvider = new EthereumAuthProvider(ethereum, currentAccount);
      await threeIdConnect.connect(authProvider);

      // set DID instance on ceramic client
      const didProvider = threeIdConnect.getDidProvider();
      ceramic.did.setProvider(didProvider);
      
      // authenticate the DID (ceramic popup)
      // returns the did
      ceramic.did.authenticate()
        .then(setDid)
        .catch(console.error);
    }

    if (currentAccount) {
      authenticateDID();
    }
  }, [setDid, ceramic, currentAccount, ethereum]);

  // load in contracts to frontend
  // is there more efficient way to do this, such as load in a script?
  // TODO: look off of other dapp examples to efficiently load in all contracts & contract methods for easy & clean access
  useEffect(() => {
    const loadContracts = async () => {
      let escrow = new web3.eth.Contract(Escrow.abi);
      let escrowDisputeManager = new web3.eth.Contract(EscrowDisputeManager.abi)
      
      setEscrowContract(escrow);
      setEscrowDisputeManager(escrowDisputeManager);
    }

    if (web3) {
      loadContracts();
    }
  }, [web3]);

  return (
    <Router>
      <Switch>
        <Route path="/dashboard">
          <Dashboard did={did} ceramic={ceramic} />
        </Route>

        <Route path="/freelancerdashboard">
          <Header />
          <FreelancerDashboard />
          <Footer />
        </Route>

        <Route path="/signupinfo">
          <SignUpForm />
        </Route>

        <Route path="/postjob">
          <Header />
          <JobForms ceramic={ceramic} />
        </Route>

        {/* render: func - passes route props (match, location, history) to BrowseGrid 
            https://reactrouter.com/core/api/Route/render-func */}
        <Route path="/browse"
          render={(props) => (
            <BrowseGrid {...props} />
          )}
        />

        <Route path="/createcontract">
          <ContractForm />
        </Route>

        <Route exact path="/">
          <Home web3={web3} ethereum={ethereum} setCurrentAccount={setCurrentAccount} did={did} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;