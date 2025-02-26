import React, { useState } from 'react';
import { CubeLoader, Modal } from '../../../../components';
import useTodo, { ITask, ITaskStatus } from '../../../../hooks/useTodo';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../../../redux';
import CreateTask from './CreateTask';
import EditTask from './EditTask';

const Todo: React.FC = () => {
    const userDetails = useSelector((state: ReduxState) => state.user);
    const {
        allowDrop,
        drag,
        drop,
        todoTask,
        setTaskToEdit,
        createTaskModal,
        setCreateTaskModal,
        setTitle,
        setDescription,
        loading,
        addTask,
        error,
        clearError,
        screenLoader,
        currentMode,
        setCurrentMode,
        inProgressTask,
        doneTask,
        taskToEdit,
        editTaskModal,
        setEditTaskModal,
        editTask,
        deleteSelectedTask,
        deleteLoading,
        deleteTaskModal,
        setDeleteTaskModal
    } = useTodo();

    const cardClick = (task: ITask) => {
        setTaskToEdit(task);
        setEditTaskModal(true);
    };

    const onCreateTask = (mode: ITaskStatus) => {
        setCreateTaskModal(true);
        setCurrentMode(mode);
    };

    if (screenLoader) {
        return (
            <div className="flex flex-col h-full w-full mt-20 items-center">
                <CubeLoader />
                <div className="mt-8 text-primary">Crunching Data...</div>
            </div>
        );
    }

    return (
        <div className="flex space-x-8 p-8 w-full">
            <div
                className="w-[33%] bg-gray-100 rounded-lg p-4 shadow column"
                id="todo"
                onDragOver={allowDrop}
                onDrop={drop}
            >
                <div className="font-semibold text-lg mb-4 text-primary ml-1">TO DO</div>
                <div id="todo-tasks" className="space-y-4">
                    {todoTask?.map((task, index) => {
                        return (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-lg shadow border flex justify-between items-center cursor-pointer"
                                draggable="true"
                                onDragStart={drag}
                                id={task.taskId}
                                onClick={() => cardClick(task)}
                            >
                                <div>
                                    <p className="font-medium">{task.title}</p>
                                    <span className="text-sm text-gray-500">{task.id}</span>
                                </div>
                                <div className="bg-emerald text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
                                    {userDetails.name.charAt(0) + userDetails.name.charAt(1)}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 text-emerald font-medium ml-1 cursor-pointer" onClick={() => onCreateTask('todo')}>
                    + Create task
                </div>
            </div>

            <div
                className="w-[33%] bg-gray-100 rounded-lg p-4 shadow column"
                id="inprogress"
                onDragOver={allowDrop}
                onDrop={drop}
            >
                <div className="font-semibold text-lg mb-4 text-primary ml-1">IN PROGRESS</div>
                <div id="in-progress-tasks" className="space-y-4">
                    {inProgressTask?.map((task, index) => {
                        return (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-lg shadow border flex justify-between items-center cursor-pointer"
                                draggable="true"
                                onDragStart={drag}
                                id={task.taskId}
                                onClick={() => cardClick(task)}
                            >
                                <div>
                                    <p className="font-medium">{task.title}</p>
                                    <span className="text-sm text-gray-500">{task.id}</span>
                                </div>
                                <div className="bg-emerald text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
                                    {userDetails.name.charAt(0) + userDetails.name.charAt(1)}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div
                    className="mt-4 text-emerald font-medium ml-1 cursor-pointer"
                    onClick={() => onCreateTask('inprogress')}
                >
                    + Create task
                </div>
            </div>

            <div
                className="w-[33%] bg-gray-100 rounded-lg p-4 shadow column"
                id="done"
                onDragOver={allowDrop}
                onDrop={drop}
            >
                <div className="font-semibold text-lg mb-4 text-primary ml-1">DONE</div>
                <div id="done-tasks" className="space-y-4">
                    {doneTask?.map((task, index) => {
                        return (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-lg shadow border flex justify-between items-center cursor-pointer"
                                draggable="true"
                                onDragStart={drag}
                                id={task.taskId}
                                onClick={() => cardClick(task)}
                            >
                                <div>
                                    <p className="font-medium">{task.title}</p>
                                    <span className="text-sm text-gray-500">{task.id}</span>
                                </div>
                                <div className="bg-emerald text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
                                    {userDetails.name.charAt(0) + userDetails.name.charAt(1)}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 text-emerald font-medium ml-1 cursor-pointer" onClick={() => onCreateTask('done')}>
                    + Create task
                </div>
            </div>

            <Modal
                isVisible={editTaskModal}
                setIsVisible={setEditTaskModal}
                title={taskToEdit?.id}
                hideHeaderBorder={true}
                isModalClosable={true}
                overflow="auto"
            >
                {taskToEdit && (
                    <EditTask
                        task={taskToEdit}
                        loading={loading}
                        editTask={(title: string, descrition: string, status: ITaskStatus) =>
                            editTask(title, descrition, status)
                        }
                        error={error}
                        clearError={clearError}
                        onDelete={deleteSelectedTask}
                        deleteLoading={deleteLoading}
                        deleteTaskModal={deleteTaskModal}
                        setDeleteTaskModal={setDeleteTaskModal}
                    />
                )}
            </Modal>

            <Modal
                isVisible={createTaskModal}
                setIsVisible={setCreateTaskModal}
                title="Create Task"
                hideHeaderBorder={true}
                isModalClosable={true}
                overflow="auto"
            >
                <CreateTask
                    setTitle={setTitle}
                    setDescription={setDescription}
                    loading={loading}
                    addTask={addTask}
                    error={error}
                    clearError={clearError}
                    currentMode={currentMode}
                />
            </Modal>
        </div>
    );
};

export default Todo;
