"use client";

import React, { useState, useEffect } from 'react';
import { Box, Flex, VStack, FormControl, FormLabel, Input, Select, HStack, Button, Stack } from '@chakra-ui/react';

interface ControlButtonProps{
    onResetClicked: () =>void;
}

const ControlButton: React.FC = () => {



     return(
        <Box borderColor="blackAlpha.500" borderWidth='1px' p={4} bg="gray.50" borderRadius="md"  mx="16px" mt="16px" >
            <Stack spacing={4} direction='row' align='center'>
            <Button colorScheme='blackAlpha' size='md'>
                Reset
            </Button>
            <Button colorScheme='pink' size='md'>
                Submit
            </Button>
            </Stack>
                
        </Box>
    );
};

export default ControlButton;