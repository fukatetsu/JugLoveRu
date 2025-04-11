"use client";

import React, { useState, useEffect } from 'react';
import { Box, Flex, VStack, FormControl, FormLabel, Input, Select, HStack } from '@chakra-ui/react';

interface DataFormProps {
  targetOption: string[];
  judgeOptions: string[];
  targetName: string;
  onFormChange: (newUserName: string, newTargetName: string) => void;
}

const DataForm: React.FC<DataFormProps> = ({ targetOption, judgeOptions,onFormChange, targetName }) => {
    const [userName, setUserName] = useState('');
    const [selectedTargetName, setTargetName] = useState(targetName);

    useEffect(() => {
        setTargetName(targetName);
      }, [targetName]);

    const handleUserNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFormChange(e.target.value, targetName);
        setUserName(e.target.value)
    };
    
    const handleTargetNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFormChange(userName, e.target.value);
        setTargetName(e.target.value);
    };

  return(
    <Box borderColor="blackAlpha.500" borderWidth='1px' p={4} bg="gray.50" borderRadius="md"  mx="16px" mt="16px" >
        <Flex width="100%" justifyContent="center" alignItems ="center" >
            
            <VStack>
            <FormControl id="userName">
            <FormLabel>User Name</FormLabel>
            <Select onChange={handleUserNameChange} placeholder='選択してください' borderColor="blackAlpha.400">
              {judgeOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="targetName">
                    <FormLabel mb="0" mr={2} whiteSpace="nowrap" minWidth="80px" flexShrink={0}>Target</FormLabel>
                    <Select value={selectedTargetName} onChange={handleTargetNameChange} placeholder='選択してください' borderColor="blackAlpha.400">
                        {targetOption.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </Select>
                </FormControl>
            </VStack>
        </Flex>
            
    </Box>
);
};

export default DataForm;