import React from 'react';
import styles from './AddBarButton.module.css';
import { MdOutlineAddBox } from "react-icons/md";

function AddBarButton({index, addBar}) {
    return (
        <div className={styles.container}>
            <MdOutlineAddBox className={styles.addIcon} onClick={() => addBar(index)}/>
        </div>
    )
}

export default AddBarButton;