import React, {Fragment} from "react";

const TableContent = ({month}) => {
    return(
        <Fragment>
            {/*
                month ? month.map( day => {
                    return(
                        <tr key={toString(day.number)} className="table__day">
                            {
                                day.dates.map( date => {
                                    return(
                                        <th key={toString(day.number)+date.title} className="day__date">
                                            {date.title}
                                        </th>
                                    )
                                } )
                            }
                        </tr>
                    )
                } ) : null
            */}
        </Fragment>
    )
}

export default TableContent;
