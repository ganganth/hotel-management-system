import {Link} from 'react-router-dom';
import {MdChevronRight} from 'react-icons/md';
import '../styles/dashboard-card.css';

const DashboardCard = ({title, url, text, link}) => {



    return (
        <div className="card mb-5" style={{width: "48%"}}>
            <Link className="img-card" to={link}>
                <img src={url} alt={url} />
            </Link>
            <div className="card-content">
                <h4 className="card-title">
                    <Link to={link}>{title}</Link>
                </h4>
                <p>
                    {text}
                </p>
            </div>
            <div className="card-read-more d-flex justify-content-center align-items-center">
                <Link to={link} className="btn btn-link btn-block d-flex align-items-center">
                    View More
                    <MdChevronRight size={24} />
                </Link>
            </div>
        </div>
    );
}

export default DashboardCard;