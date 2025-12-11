const priceCounter = (rent_start_date: string, rent_end_date: string, vehicleResult: any) => {
    const number_of_days = (new Date(rent_end_date).getTime() - new Date(rent_start_date).getTime()) / (1000 * 3600 * 24) + 1;
    const daily_rent_price = Number(vehicleResult.rows[0].daily_rent_price);
    const total_price = daily_rent_price * number_of_days
    return { total_price }
}



const formatDate = (date: string | Date) => {
    return new Date(date).toISOString().split("T")[0];
};



const queryFunction = () => {
    const vehicleResultQuery = `SELECT id, vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1`;
    const insertQuery = `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`;
    const updateVehicleStatusQuery = `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`
    return { vehicleResultQuery, insertQuery, updateVehicleStatusQuery };
};

export { priceCounter, formatDate, queryFunction };