import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from '../redux';
import { createTask, deleteTask, fetchTasks, updateTask, updateTaskStatus } from '../adapters';

export type ITaskStatus = 'todo' | 'inprogress' | 'done';

export interface ITask {
    id: string;
    title: string;
    description: string;
    status: ITaskStatus;
    taskId: string;
}

const useTodo = () => {
    const userDetails = useSelector((state: ReduxState) => state.user);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [screenLoader, setScreenLoader] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [createTaskModal, setCreateTaskModal] = useState<boolean>(false);
    const [todoTask, setTodoTask] = useState<ITask[]>([]);
    const [inProgressTask, setInProgressTask] = useState<ITask[]>([]);
    const [doneTask, setDoneTask] = useState<ITask[]>([]);
    const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null);
    const [currentMode, setCurrentMode] = useState<ITaskStatus>('todo');
    const [editTaskModal, setEditTaskModal] = useState<boolean>(false);
    const [deleteTaskModal, setDeleteTaskModal] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

    const mapping = {
        todo: todoTask,
        inprogress: inProgressTask,
        donoe: doneTask
    };

    const setMapping = {
        todo: setTodoTask,
        inprogress: setInProgressTask,
        donoe: setDoneTask
    };

    useEffect(() => {
        (async () => {
            setScreenLoader(true);
            const tasks = await fetchTasks(userDetails.userId);
            setTodoTask(tasks.todo);
            setInProgressTask(tasks.inprogress);
            setDoneTask(tasks.done);
            setScreenLoader(false);
        })();
    }, []);

    const addTask = async (type: ITaskStatus) => {
        setError('');
        if (!title || !description) {
            setError('Please enter all the details above');
            return;
        } else {
            try {
                setLoading(true);
                const response = await createTask(userDetails.userId, title, description, type);
                if (response.message === 'Success') {
                    const data = mapping[type];
                    const updatedData = data.concat(response.data);
                    setMapping[type](updatedData);
                    setCreateTaskModal(false);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error.message);
            }
        }
    };

    const editTask = async (title: string, description: string, status: ITaskStatus) => {
        try {
            if (taskToEdit) {
                setLoading(true);
                const response = await updateTask(userDetails.userId, taskToEdit?.taskId, title, description, status);
                if (response === 'Success') {
                    setScreenLoader(true);
                    setEditTaskModal(false);
                    const tasks = await fetchTasks(userDetails.userId);
                    setTodoTask(tasks.todo);
                    setInProgressTask(tasks.inprogress);
                    setDoneTask(tasks.done);
                    setScreenLoader(false);
                }
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    const deleteSelectedTask = async () => {
        if (taskToEdit) {
            setDeleteLoading(true);
            const response = await deleteTask(userDetails.userId, taskToEdit?.taskId);
            if (response === 'Success') {
                setEditTaskModal(false);
                setDeleteTaskModal(false);
                setScreenLoader(true);
                const tasks = await fetchTasks(userDetails.userId);
                setTodoTask(tasks.todo);
                setInProgressTask(tasks.inprogress);
                setDoneTask(tasks.done);
                setScreenLoader(false);
                setDeleteLoading(false);
            }
        }
    };

    const clearError = () => setError('');

    // Allow dropping items into a column
    const allowDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    // Start dragging a task card
    const drag = (event: React.DragEvent<HTMLDivElement>) => {
        const taskId = event.currentTarget.id;
        const sourceColumnId = event.currentTarget.closest('.column')?.id;
        event.dataTransfer.setData('text', JSON.stringify({ taskId, sourceColumnId }));
    };

    // Drop the task card into the target column
    const drop = async (event: React.DragEvent<HTMLDivElement>) => {
        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        const { taskId, sourceColumnId } = data;
        const destinationColumn = event.currentTarget.closest('.column')?.id as ITaskStatus;
        event.preventDefault();
        const taskCard = document.getElementById(taskId);

        // Identify the target container explicitly
        const targetContainer =
            event.currentTarget.closest('.space-y-4') || event.currentTarget.querySelector('.space-y-4');

        if (targetContainer && taskCard) {
            targetContainer.appendChild(taskCard);
            await updateTaskStatus(userDetails.userId, taskId, destinationColumn);
        }
    };

    return {
        allowDrop,
        drag,
        drop,
        todoTask,
        setTaskToEdit,
        setTitle,
        setDescription,
        loading,
        addTask,
        error,
        clearError,
        createTaskModal,
        setCreateTaskModal,
        screenLoader,
        setCurrentMode,
        currentMode,
        inProgressTask,
        doneTask,
        taskToEdit,
        editTask,
        setEditTaskModal,
        editTaskModal,
        deleteLoading,
        deleteSelectedTask,
        deleteTaskModal,
        setDeleteTaskModal
    };
};

export default useTodo;
