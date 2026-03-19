import {useState, useEffect} from 'react'

export function useMembersData(){
  const [members, setMembers] = useState([])
  useEffect(()=>{
    // placeholder: fetch members from API
    setMembers([])
  },[])
  return {members}
}
