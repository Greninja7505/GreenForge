import { createContext, useContext } from 'react';

const ContractContext = createContext();

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within ContractProvider');
  }
  return context;
};

export const ContractProvider = ({ children }) => {
  const contractIds = {
    projectFunding: 'CAYI6U5R3NYJRBDOZIX5OOUC6QXM6XU4QYH4CSHZRYKWD5OUT42HRISL',
    rewardToken: 'test',
  };

  return (
    <ContractContext.Provider value={contractIds}>
      {children}
    </ContractContext.Provider>
  );
};