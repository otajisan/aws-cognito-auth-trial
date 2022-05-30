import axios from "axios";
import {useEffect, useState} from "react";

export const useGreetingMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [greetingMessage, setGreetingMessage] = useState<GreetingMessage>();

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');

    const f = async () => {
      return await getGreetingMessage();
    }

    f().then(r => {
      if (r === null || typeof r === 'undefined') {
        return;
      }
      setGreetingMessage(r);
    }).catch((e) => {
      setIsError(true);
      setErrorMessage(e.message);
    }).finally(() => setIsLoading(false));

  }, []);

  return {
    isLoading,
    isError,
    errorMessage,
    greetingMessage,
  };
};

const getGreetingMessage: () => Promise<GreetingMessage> = async () => {
  const message = 'Welcome!';
  return await axios
    .get('/api/greeting/' + message, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((res) => res.data);
};

type GreetingMessage = {
  message: string,
};