import { useToast } from '@chakra-ui/react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchTodos, createTodo } from '../services/todos';
import { TodoState } from '../types/todo';
import { Todo } from '../types/todo';

const useAddNewTodoQuery = (title: string) => {
  const toast = useToast();
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => createTodo(title),
    onSuccess: (newTodo) => {
      // client.getQueryData(['todos', 'all'])
      client.setQueriesData<Todo[]>(['todos', 'all'], (oldTodos) => {
        return [...((oldTodos as Todo[]) || []), newTodo];
      });
      client.setQueriesData<Todo[]>(['todos', 'open'], (oldTodos) => {
        return [...((oldTodos as Todo[]) || []), newTodo];
      });
      client.invalidateQueries({
        queryKey: ['todos', 'all'],
        refetchType: 'none',
      });
      client.invalidateQueries({
        queryKey: ['todos', 'open'],
        refetchType: 'none',
      });
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast({
          status: 'error',
          title: err.message,
          position: 'top-right',
        });
      }
    },
  });
};

export { useAddNewTodoQuery };
