truffle-ganache-metamask: contracts and dApp development    
  
required:    
truffle    
ganache  
metamask  
lite-server  
  
install:  
(1) choose parent directory for repo-clone - cd there  
(2) git clone https://github.com/josefK128/truffle-ganache-metamask.git    
(3) cd into repo root    
(4) npm install    
  
// compile/test/migrate contract   
(5) truffle compile  
(6) truffle test  
(7) launch ganache  
(8) truffle migrate --reset  
  
// simply run dApp   
(9) click metamask in Chrome  
(10a) enter password  OR  
(10b) choose restore from seed - used seed phrase shown in ganache  
    then choose a password  
(11) make certain the network is private ganache!!! (localhost:7545)  
(12) npm run dev (runs lite-server) => dApp launches in browser window  
(13) choose dog - click adopt - should change to 'success' - may need to  
     refresh browser  
