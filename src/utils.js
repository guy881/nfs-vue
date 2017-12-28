import swal from 'sweetalert2'

export function askForDeletion () {
  return swal({
    title: 'Are you sure?',
    text: 'Do you want to delete this entry?',
    type: 'question',
    confirmButtonText: 'Delete',
    showCancelButton: true
  })
}

export function confirmDeleted () {
  return swal(
    'Deleted!',
    'The entry has been deleted.',
    'success'
  )
}
