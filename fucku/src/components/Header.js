import PropTypes from 'prop-types';

const Header = (props) => {//ignore the error here, it is purpoefully a link to nowhere
    return(
    <header> 
        <h1 id="title"><a className="neon">RED</a> FLAGS</h1>
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

//const style = {
//    color: "pink", 
//    backgroundColor:"black",
//    display: "none"
//}

export default Header;
