import Swal from 'sweetalert2'

const defaultButtonColor = '#2563eb'

const notify = {
    success: (title = 'Success', text = '') => {
        return Swal.fire({
            icon: 'success',
            title,
            text,
            confirmButtonColor: defaultButtonColor,
        })
    },
    error: (title = 'Error', text = '') => {
        return Swal.fire({
            icon: 'error',
            title,
            text,
            confirmButtonColor: defaultButtonColor,
        })
    },
    info: (title = 'Info', text = '') => {
        return Swal.fire({
            icon: 'info',
            title,
            text,
            confirmButtonColor: defaultButtonColor,
        })
    },
    confirm: (options = {}) => {
        return Swal.fire({
            icon: options.icon || 'question',
            title: options.title || 'Are you sure?',
            text: options.text || '',
            showCancelButton: true,
            confirmButtonText: options.confirmText || 'Yes',
            cancelButtonText: options.cancelText || 'Cancel',
            confirmButtonColor: defaultButtonColor,
        })
    }
}

export default notify
