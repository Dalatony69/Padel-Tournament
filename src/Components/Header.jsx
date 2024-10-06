import React,{useEffect,useState} from "react";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function Header(){

    const [name,setname] = useState(null);

    useEffect(
     () => {GetUserName()}
    ,[]);

    const GetUserName = async() => {
        try{
             const response = await fetch('http://51.20.32.239:5000/WhoCurrent');
            if (!response.ok) {
               alert('Network response was not ok');
                }
                const data = await response.json();
                 setname(data[0] + ' / ' + data[1]);
                }
         catch(e){
                 alert("Errrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
                }
    }

    return(
        <Navbar bg="dark" data-bs-theme="dark">
            <Container className="d-flex">
                <Navbar.Brand>Sparx</Navbar.Brand>
                <Navbar.Text>Signed in as : <span>{name}</span> </Navbar.Text>
            </Container>
        </Navbar>
    );
}
export default Header;