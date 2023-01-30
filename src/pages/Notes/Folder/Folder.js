import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { onValue, push, ref, remove, set } from 'firebase/database'
import { rdb } from '../../../firebase'
import { useAuth } from '../../../context/AuthContext'
import { Add, ArrowBack, Delete, Note, TextSnippet } from '@mui/icons-material'


const Folder = () => {

    const { currentUser } = useAuth()

    const navigation = useNavigate()

    const location = useLocation()

    const [folder, setFolder] = useState()
    const [notes, setNotes] = useState()
    const [allNotes, setAllNotes] = useState()

    let path = location.pathname
    let path_id = path.toString().substring(43)


    const getFolder = () => {
        const starCountRef = ref(rdb, `notes/${currentUser.uid }/folders/${path_id}/`);
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            setFolder(data);
        });
    }

    const getNotes = () => {
        const starCountRef = ref(rdb, `notes/${currentUser.uid }/folders/${path_id}/notes/`);
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            setNotes(data);
        });
    }

    useEffect(() => {
        console.log(path_id)
        getFolder()
        getNotes()
    }, [])

    useEffect(() => {

        let array = []
            
         for(let i in notes) {
             array.push(notes[i])
             setAllNotes(array)
         }
         if(array.length === 0) {
             setAllNotes(array)
         }
    
      }, [notes])

      const handleDeleteFolder = () => {
        remove(ref(rdb, 'notes/' + currentUser.uid + "/folders/" + path_id))
        navigation("/notes")
      }

  return (
    <div className='content-notes' >
        <div className='all-notes-folder' >
             <div className='back' >
                <Link to="/notes">
                    <ArrowBack />
                </Link>
            </div>
            {folder && 
            <div className='titles' >
            <TextSnippet className='titles-icon' />
            <h3>{folder.folder_name}</h3>
            <Link className='create-icon' to="/notes/create">
             <Add/>
          </Link>
            <Delete className='create-icon-delete' onClick={handleDeleteFolder} />
            </div>
            }
            <div className='notes' >
            {allNotes &&
                allNotes.map((n) => (
                    <Link className='note-a' to={"/notes/note/" + currentUser.uid +"/"+n.id} >
                    <div className='note' key={n.id} >
                       <Note />
                      {n.note_name && <h4>{n.note_name.length > 60 ? n.note_name.substr(0, 50) + "..." : n.note_name}</h4> }
                    </div>
                    </Link>
                ))
            }
             {
                !notes && folder && <p className='no-notes' >Nemáš žiadne poznámky v priečinku {folder.folder_name} zatiaľ, stáčí kliknuť na plusko a možeš si vytvoriť novú poznámku.</p>
            }
        </div>
        </div>
    </div>
  )
}

export default Folder