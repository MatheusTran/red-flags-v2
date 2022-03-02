import React, {useState, useEffect} from 'react'

export default function DiceBear(props) {
    const [url, setUrl] = useState(`https://avatars.dicebear.com/api/avataaars/${props.seed}.svg`)
    useEffect(()=>{
        setUrl(`https://avatars.dicebear.com/api/avataaars/${props.seed}.svg`)
    },[props.seed])
    return (
        <img src={url} alt={props.seed} title={props.seed} style={{width:"20%"}}/>
    )
}
