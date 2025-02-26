import React from 'react';
import { Button, ErrorContainer, Input } from '../../../../components';
import { ITaskStatus } from '../../../../hooks/useTodo';

interface ICreateTask {
    setTitle: (value: string) => void;
    setDescription: (value: string) => void;
    loading: boolean;
    addTask: (status: ITaskStatus) => void;
    error: string;
    clearError: () => void;
    currentMode: ITaskStatus;
}

const CreateTask: React.FC<ICreateTask> = ({
    setTitle,
    setDescription,
    loading,
    addTask,
    error,
    clearError,
    currentMode
}) => {
    return (
        <div className="flex flex-col">
            <Input onChange={(e) => setTitle(e.target.value)} title={'Title'} mandatory={true} />
            <div className="text-primary font-medium mb-1">
                {'Description'} <span className="text-errorText -ml-1">*</span>
            </div>
            <textarea
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-emerald focus:ring-[0.8] focus:ring-emerald"
                rows={6}
                placeholder="Enter description here"
                onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {error && (
                <div className="flex self-center mt-4">
                    <ErrorContainer message={error} onCloseClick={clearError} />
                </div>
            )}
            <div className="mt-8 w-[50%] self-center items-center">
                <Button
                    text={'Create'}
                    onClick={() => addTask(currentMode)}
                    background={'bg-fillGreen'}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default CreateTask;
