import React , { useState, useEffect } from 'react';
import { Form, Button } from "react-bootstrap"
import { useAuth } from '../../context/AuthContext'
import firebase from '../../firebase';


    function AddCategory(){
        // criar variáveis para usar no controlo
        const { currentUser, logout } = useAuth()
        const [category, setCategory] = useState('');
        const [categories, setCategories] = useState([]);
        const [categoryCreate, setCategoryCreate] = useState(true);

        // vai buscar todas as categorias adicionadas anteriormente
        useEffect(() => {
            var user = firebase.auth().currentUser;
            const ref = firebase.firestore().collection("categories").where("userId", "==", user.uid)
            ref.onSnapshot((querySnapchot) => {
                const items = [];
                querySnapchot.forEach((doc) => {
                    items.push(doc.data())
                });
                setCategories(items);
            })
        }, []);



        // adicionar nova categoria
        function addNewCategory(e){
            e.preventDefault()
            setCategoryCreate(true);
            for(let i = 0; i < categories.length; i++) {
                if(categories[i].titulo == category){setCategoryCreate(false)}
            };
            if(categoryCreate){
                const db = firebase.firestore()
                db.collection("categories").add({
                    titulo:category,
                    userId: currentUser.uid
                })
                // repor valor inicial dos campos
                setCategory('')
            }
    }

    return(
        <div className='mt-1 mb-3'>
            <Form onSubmit={addNewCategory}>
                <h2 className='text-center title-dash'>Add new category</h2>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" value={category} onChange={(e) => setCategory(e.target.value)}></Form.Control>
                </Form.Group>
                <span style={{ display: categoryCreate ? "none" : "block"}} className="error">Category already exists</span>
                <Button variant="primary" type="submit" block >Add</Button>                                        
            </Form>
        </div>
    );
}

export default AddCategory;