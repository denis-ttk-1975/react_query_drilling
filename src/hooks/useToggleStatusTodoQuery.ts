import { useToast } from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTodos, toggleTodoStatus } from '../services/todos';
import { TodoState } from '../types/todo';
import { Todo } from '../types/todo';

const useToggleStatusTodoQuery = (id: number, completed: boolean) => {
  const toast = useToast();
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => toggleTodoStatus(id, !completed),
    onSuccess: (newTodo) => {
      // client.setQueriesData<Todo[]>(['todos'], (oldTodos) => {
      //   if (oldTodos) {
      //     console.log('oldTodos: ', oldTodos);

      //     oldTodos[id - 1] = newTodo;
      //   }
      //   return [...((oldTodos as Todo[]) || [])];
      // });
      client.invalidateQueries({
        queryKey: ['todos'],
        // refetchType: 'none',
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

export { useToggleStatusTodoQuery };
