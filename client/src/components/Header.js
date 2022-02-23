import PropTypes from 'prop-types';

const Header = (props) => {
    return(
    <header> 
        <h1 id="title"><a style={antiLink} href={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX/AAAZ4gk3AAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC"} className="neon">RED</a> FLAGS</h1>
        <h1 id="subtitle">{props.text}</h1>
    </header>
    );
};

Header.defaultProps = {
    text: "for some reason I could not pick a random quote"
}

Header.propTypes = {
    text: PropTypes.string.isRequired
}

const antiLink = {
    textDecoration:"none",
    color:"white"
}

//const style = {
//    color: "pink", 
//    backgroundColor:"black",
//    display: "none"
//}

export default Header;
