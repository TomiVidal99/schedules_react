import React from 'react';

// import components
import TableContent from './TableContent';

const SchedulesContainer = ({month}) => {
    return(
        <div className="schedules-container">
            <table className="schedules-table">
                <thead className="table__header">
                    <tr>
                        <th>Sunday</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                        <th>Saturday</th>
                    </tr>
                </thead>
                <tbody>
                    <TableContent month={month} />
                </tbody>
            </table>
        </div>
    )
}

export default SchedulesContainer;
