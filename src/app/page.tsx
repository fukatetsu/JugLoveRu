"use client";
import React,{ useState , useEffect, Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
	Box,
	Button,
	Flex,
	Input,
	VStack,
	Text,
	Select,
	Icon,
  HStack,
  ChakraProvider,
  Stack,
  IconButton,
  useDisclosure,
  AlertDialog,              
  AlertDialogOverlay,       
  AlertDialogContent,       
  AlertDialogHeader,        
  AlertDialogBody,          
  AlertDialogFooter         
} from '@chakra-ui/react';

import { BiSolidLike } from "react-icons/bi";
import { Provider } from '@chakra-ui/react/dist/types/provider/provider';
import { EmailIcon } from '@chakra-ui/icons';
import axios from 'axios';

import {API_ENDPOINTS} from './ipconfig.js';
import {targetOption} from './targetconfig.js';



type ClickData = {
    timestamp: string;
    value: number;
};

const DataForm = dynamic(() => import('../components/DataForm'), {suspense: true});

const ControllButton = dynamic(() => import('../components/ControlButton'));

const Page: React.FC = () => {
    // const targetOption = ['1 リング わっか星人', '2 ボール よんたま'];
    const [userName, setUserName] = useState('');
    const [targetName, setTargetName] = useState('');

    const [goodCount, setGoodCount] = useState(0);

    const [clickData, setClickData] = useState<ClickData[]>([]);

    const [targetOptions, setTargetOptions] = useState<string[]>([]);
    const [judgeList, setJudgeList] = useState<string[]>([]);

    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

    const openResetDialog = () => setIsResetDialogOpen(true);    
    const closeResetDialog = () => setIsResetDialogOpen(false); 
    
    const cancelRef = useRef(null);

    const {
      isOpen: isResetOpen,
      onOpen: onResetOpen,
      onClose: onResetClose
    } = useDisclosure();

    const {
      isOpen: isSubmitOpen,
      onOpen: onSubmitOpen,
      onClose: onSubmitClose
    } = useDisclosure();
  
    useEffect(() => {
      const fetchTargetOptions = async () => {
        try {
          const response = await axios.get(`${API_ENDPOINTS.GET_PLAYER_LIST}?action=getPlayerList`);
          const targets = response.data.targets;
          const formatted = targets.map((item: any) => `${item.group}_${item.number}_${item.prop}_${item.name}`);
          setTargetOptions(formatted);
        } catch (error) {
          console.error('ターゲットオプションの取得に失敗しました:', error);
        }
      };
      const fetchJudgeList = async () => {
        try {
          const response = await axios.get(`${API_ENDPOINTS.GET_JUDGE_LIST}?action=getJudgeList`);
          setJudgeList(response.data.judges || []);
        } catch (error) {
          console.error('審査員リストの取得に失敗しました:', error);
        }
      };
      fetchJudgeList();
      fetchTargetOptions();
    }, []);

    const handleFormChange = (newUserName: string, newTargetName: string) => {
      setUserName(newUserName);
      setTargetName(newTargetName);
    };

    const onGoodButtonClicked = ()=>{
        setGoodCount((prevCount) => prevCount +1);
        const currentTime = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        const newClickData = { timestamp: currentTime, value: clickData.length + 1 }; // クリック回数を値とする
        setClickData([newClickData, ...clickData]); // 新しいデータを配列に追加
    };

    const sendData = async () => {
        const sortedData = [...clickData].sort((a, b) => a.value - b.value);
        const dataToSend = {
          userName: userName,
          targetName: targetName,
          data: sortedData, // 収集したクリックデータ
        };
    
        try {
          const response = await axios.post(API_ENDPOINTS.ADD_DATA, dataToSend, {
            headers: {
              "Content-Type": "text/plain",  // JSON データを送信するためのヘッダー
            },
          });
          console.log(response.data);  // レスポンスを確認
          alert('データ送信成功！');  // 送信成功メッセージ
          setGoodCount(0);  // 送信後の処理
          setClickData([]);  // クリックデータのリセット
          setTargetName('');
        } catch (error) {
          console.error('エラーが発生しました:', error);
        }
      };

      const resetData = () => {
        setTargetName('');
        setGoodCount(0);
        setClickData([]);
    };
  
    return (            
      <>
      <VStack bgColor={'blue.50'}>
        <DataForm
          targetOption={targetOptions}
          judgeOptions={judgeList}
          targetName={targetName}
          onFormChange={handleFormChange}
        />
        <Box borderColor="blackAlpha.500" borderWidth='1px' p={4} bg="gray.50" borderRadius="md" mx="16px" mt="16px">
          <Stack spacing={4} direction='row' align='center'>
            <Button colorScheme='blackAlpha' size='md' onClick={onResetOpen}>Reset</Button> 
            <Button colorScheme='pink' size='md' onClick={() => {
              if (!targetName || !userName) {
                alert("ターゲットを選択してください！"); 
                return;
              }
              onSubmitOpen(); 
            }}>
              Submit
            </Button>
 
          </Stack>
        </Box>
        <BiSolidLike size={"200px"} color='gray' onClick={onGoodButtonClicked} />
        <Text>{goodCount}</Text>
        <h2>現在のデータ</h2>
        <ul>
          {clickData.map((entry, index) => (
            <li key={index}>
              {`時刻: ${entry.timestamp}, 値: ${entry.value}`}
            </li>
          ))}
        </ul>
      </VStack>

      <AlertDialog isOpen={isResetOpen} leastDestructiveRef={cancelRef} onClose={onResetClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>リセット確認</AlertDialogHeader>
            <AlertDialogBody>本当にリセットしますか？</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onResetClose}>いいえ</Button>
              <Button colorScheme='red' onClick={() => { resetData(); onResetClose(); }} ml={3}>
                はい
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog isOpen={isSubmitOpen} leastDestructiveRef={cancelRef} onClose={onSubmitClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>送信確認</AlertDialogHeader>
            <AlertDialogBody>{targetName}のデータを送信しますか？</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onSubmitClose}>いいえ</Button>
              <Button colorScheme='blue' onClick={() => { sendData(); onSubmitClose(); }} ml={3}>
                はい
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

  
  export default Page;