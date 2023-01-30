import { Add, AutoAwesomeMosaic, Folder, Note, Remove, TextSnippet } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { onValue, push, ref, set } from 'firebase/database'
import { rdb } from '../../../firebase'
import { useAuth } from '../../../context/AuthContext'

const AllNotes = () => {

    const { currentUser } = useAuth()

    const [notes, setNotes] = useState()
    const [allNotes, setAllNotes] = useState()
    const [folders, setFolders] = useState()
    const [allFolders, setAllFolders] = useState()

    const [folderName, setFolderName] = useState("")

    const [createNewFolder, setCreateNewFolder] = useState(false)

    const getNotes = () => {
        const starCountRef = ref(rdb, `notes/${currentUser.uid}/all/`);
        onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setNotes(data);
        });
    }

    const getFolders = () => {

        const starCountRef = ref(rdb, `notes/${currentUser.uid}/folders`);
        onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setFolders(data);
        });

    }
    
    useEffect(() => {
        getNotes()
        getFolders()
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

    useEffect(() => {

        let array = []
            
         for(let i in folders) {
             array.push(folders[i])
             setAllFolders(array)
         }
         if(array.length === 0) {
             setAllFolders(array)
         }
    
      }, [folders])
    

    const handleAddFolder = () => {

        if(folderName.length > 2) {
            const autoId = push(ref(rdb, 'notes/' + currentUser.uid + "/folders")).key
    
            set(ref(rdb, 'notes/' + currentUser.uid + "/folders/" + autoId + "/"), {
                folder_name: folderName,
                timestamp: new Date().valueOf(),
                id: autoId
             });
    
             setFolderName("")
             setCreateNewFolder(false)
        }

    }

 

  return (
    <div className='content-notes' >
    <div className='all-notes' >
        <div className='titles' >
          <TextSnippet className='titles-icon' />
          <h3>Všetky poznamky</h3>
          <Link className='create-icon' to="/notes/create">
             <Add/>
          </Link>
        </div>
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
                !notes && <p className='no-notes' >Nemáš žiadne poznámky zatiaľ, stáčí kliknuť na plusko a možeš si vytvoriť novú poznámku.</p>
            }
        </div>
    </div>
    <div className='all-fields' >
      <div className='titles' >
          <AutoAwesomeMosaic  className='titles-icon'  />
          <h3>Priečinky</h3>
             { !createNewFolder && <Add onClick={() => {setCreateNewFolder(!createNewFolder)}} className='create-icon' />}
             { createNewFolder && <Remove onClick={() => {setCreateNewFolder(!createNewFolder)}} className='create-icon' />}
            {createNewFolder &&
                <div>
                    <input className='input-for-folder' onChange={(e) => {setFolderName(e.target.value)}} placeholder='Nazov priečinku..' />
                    <button  onClick={handleAddFolder} className='add-folder' >Pridať</button>
                </div>
            }
        </div>
        <div className='folders' >
            {allFolders &&
                allFolders.map((n) => (
                    <Link className='folder-a' to={"/notes/folder/" + currentUser.uid +"/"+n.id} >
                    <div className='folder' key={n.id} >
                       <Folder />
                      {n.folder_name && <h4>{n.folder_name.length > 60 ? n.folder_name.substr(0, 50) + "..." : n.folder_name}</h4> }
                    </div>
                    </Link>
                ))
            }
            {
                !folders && <p className='no-notes' >Pre lepšiu organizaciu v poznámkach si stačí vytvorit priečinok pre určité poznámky.</p>
            }
        </div>
    </div>
    </div>
  )
}

export default AllNotes