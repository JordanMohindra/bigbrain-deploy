"use client"

const DeleteGameModal = ({ showModal, gameToDelete, onCancel, onConfirm }) => {
  if (!showModal || !gameToDelete) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p className="mb-4">
          Are you sure you want to delete the game “{gameToDelete?.name}“? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="btn btn-outline">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteGameModal
