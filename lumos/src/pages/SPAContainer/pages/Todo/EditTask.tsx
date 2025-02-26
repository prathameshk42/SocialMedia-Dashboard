import React, { useState } from 'react';
import { Button, ErrorContainer, Input, Modal } from '../../../../components';
import { ITask, ITaskStatus } from '../../../../hooks/useTodo';
import { DownIcon, EditIcon } from '../../../../assets';

interface IEditTask {
    task: ITask;
    loading: boolean;
    editTask: (title: string, descrition: string, status: ITaskStatus) => void;
    error: string;
    clearError: () => void;
    onDelete: () => void;
    deleteLoading: boolean;
    deleteTaskModal: boolean;
    setDeleteTaskModal: (value: boolean) => void;
}

interface IStatusList {
    label: string;
    value: ITaskStatus;
}

const statusList: IStatusList[] = [
    { label: 'TODO', value: 'todo' },
    { label: 'In Progress', value: 'inprogress' },
    { label: 'Done', value: 'done' }
];

const EditTask: React.FC<IEditTask> = ({
    task,
    loading,
    editTask,
    error,
    clearError,
    onDelete,
    deleteTaskModal,
    deleteLoading,
    setDeleteTaskModal
}) => {
    const [editedTitle, setEditedTitle] = useState<string>(task.title);
    const [editedDescription, setEditedDescription] = useState<string>(task.description);
    const [editedStatus, setEditedStatus] = useState<ITaskStatus>(task.status);
    const [editTitle, setEditTitle] = useState<boolean>(false);
    const [editDescription, setEditDescription] = useState<boolean>(false);
    const [editStatus, setEditStatus] = useState<boolean>(false);
    const isChanged =
        editedTitle !== task.title || editedDescription !== task.description || editedStatus !== task.status;

    const onEditTask = () => {
        if (isChanged)
            editTask(
                editedTitle ? editedTitle : task.title,
                editedDescription ? editedDescription : task.description,
                editedStatus ? editedStatus : task.status
            );
    };

    const onStatusClick = () => {
        const menu = document.getElementById('dropdown-menu');
        menu?.classList.toggle('hidden');
    };

    const selectStatus = (status: ITaskStatus) => {
        setEditedStatus(status);
        onStatusClick();
    };

    return (
        <div className="flex flex-col gap-6 text-primary">
            <div className="flex justify-between mt-4">
                {editTitle ? (
                    <div className="flex flex-col w-[80%]">
                        <div className="text-primary mb-1 text-xl font-semibold">
                            {'Title'} <span className="text-errorText -ml-1">*</span>
                        </div>
                        <input
                            type={'text'}
                            placeholder={`Enter title`}
                            value={editedTitle}
                            className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-emerald focus:ring-[0.8] focus:ring-emerald"
                            onChange={(e) => setEditedTitle(e.target.value)}
                        />
                    </div>
                ) : (
                    <div className="text-2xl font-bold text-emerald">{task.title}</div>
                )}
                <img width={30} src={EditIcon} className="cursor-pointer" onClick={() => setEditTitle(true)} />
            </div>
            <div>
                <div className="flex justify-between">
                    <div className="text-xl font-semibold">Description</div>
                    <img
                        width={30}
                        src={EditIcon}
                        className="cursor-pointer"
                        onClick={() => setEditDescription(true)}
                    />
                </div>
                {editDescription ? (
                    <textarea
                        className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-emerald focus:ring-[0.8] focus:ring-emerald"
                        rows={6}
                        value={editedDescription}
                        placeholder="Enter description here"
                        onChange={(e) => setEditedDescription(e.target.value)}
                    />
                ) : (
                    <div className="text-primary w-[85%] mt-2">{task.description}</div>
                )}
            </div>

            <div className="relative inline-block text-left">
                <div className="flex justify-between">
                    <div className="text-xl font-semibold">Status</div>
                    <img width={30} src={EditIcon} className="cursor-pointer" onClick={() => setEditStatus(true)} />
                </div>
                {editStatus ? (
                    <>
                        <button
                            className="inline-flex justify-center w-[30%] rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald"
                            onClick={onStatusClick}
                        >
                            <div className="flex justify-between w-full">
                                {editedStatus}
                                <img width={20} src={DownIcon} />
                            </div>
                        </button>

                        <div
                            className="origin-top-right absolute left-0 mt-2 w-[40%] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hidden"
                            id="dropdown-menu"
                        >
                            {statusList.map((status) => {
                                return (
                                    <div className="py-1" onClick={() => selectStatus(status.value)}>
                                        <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                                            {status.label}
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="text-primary w-[85%] mt-2">{task.status}</div>
                )}
            </div>

            {error && (
                <div className="flex self-center mt-4">
                    <ErrorContainer message={error} onCloseClick={clearError} />
                </div>
            )}
            <div className="flex gap-8 mt-8 self-center items-center">
                <Button
                    text={'Delete Task'}
                    onClick={() => setDeleteTaskModal(true)}
                    background={'bg-errorText'}
                    loading={loading}
                />
                <Button
                    text={'Save Changes'}
                    onClick={() => isChanged && onEditTask()}
                    background={isChanged ? 'bg-fillGreen' : 'bg-disabled'}
                    loading={loading}
                />
            </div>

            <Modal
                isVisible={deleteTaskModal}
                setIsVisible={setDeleteTaskModal}
                title={'Are you sure?'}
                hideHeaderBorder={true}
                isModalClosable={true}
                overflow="auto"
            >
                <div className="p-2xl">
                    <div className="text-lg pb-xxs text-primary font-medium">
                        {'This would delete your task permanently.'}
                    </div>
                    <div className="text-base font-medium text-primary">{'Do you want to proceed?'}</div>
                    <div className="flex w-full gap-x-4 my-8 justify-center">
                        <div className="w-[30%]">
                            <Button
                                text={'Back'}
                                onClick={() => setDeleteTaskModal(false)}
                                background={'bg-hoverEmerald'}
                            />
                        </div>
                        <div className="w-[30%]">
                            <Button
                                text={'Delete'}
                                onClick={onDelete}
                                background={'bg-errorText'}
                                loading={deleteLoading}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EditTask;
