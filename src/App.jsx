import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

async function fetchBusArrival(id) {
  const response = await fetch(`https://sg-bus-arrivals.vercel.app/?id=${id}`);
  if (!response.ok) {
    throw new Error(`${id} Bus Stop ID not found`);
  }
  const data = await response.json();
  if (!data.services || data.services.length === 0) {
    throw new Error(`${id} Bus Stop ID not found`);
  }
  return data;
}

export default function App() {
  const [busStopId, setBusStopId] = useState("");
  const [busArrivalData, setBusArrivalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (busStopId) {
      setLoading(true);
      setError(""); // Clear previous error
      fetchBusArrival(busStopId)
        .then((data) => setBusArrivalData(data))
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }
  }, [busStopId]);

  function handleInputChange(event) {
    setBusStopId(event.target.value);
  }

  return (
    <div className="container-fluid min-vh-100">
      <div className="row h-100">
        <div className="col-md-6 d-flex flex-column align-items-center p-4 h-100">
          <img
            src="/src/assets/images/red-bus.png"
            alt="Bus"
            className="img-fluid mb-4"
            style={{ maxWidth: '80%', marginTop: '40px' }}
          />
          <h1>Bus Arrival App</h1>
          <p>
            To experience the app, please enter the bus stop ID (e.g., 18141) or visit&nbsp;
            <a href="https://www.simplygo.com.sg/travel-guide" target="_blank" rel="noopener noreferrer">this link</a> to find your bus number.
          </p>
        </div>

        <div className="col-md-6 p-4 mt-4 h-100 bg-light">
          <h4>Enter Bus Stop ID</h4>
          <div className="input-group mb-3">
            <input
              type="number"
              className="form-control rounded-start focus-ring"
              value={busStopId}
              onChange={handleInputChange}
              placeholder="Bus Stop ID"
            />
            <i className="bi bi-arrow-up"></i>
            <i className="bi bi-arrow-down ms-1"></i>
          </div>

          {loading && (
            <div className="d-flex flex-column align-items-center h-100 bg-light" style={{ height: '100px' }}>
              <img
                src="/src/assets/images/bus-loading.svg"
                alt="Loading"
                className="img-fluid"
                style={{ width: "80px", height: "80px" }}
              />
              <p className="text-primary">Loading...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger mt-4" role="alert">
              {error}
            </div>
          )}

          {busArrivalData && busArrivalData.services && !error && (
            <div className="container mt-4">
              <h3 className="mb-4">Bus Stop {busArrivalData.bus_stop_id}</h3>
              {busArrivalData.services.map((service) => (
                <div
                  key={service.bus_no}
                  className="d-flex justify-content-between align-items-center p-3 border rounded mb-4"
                  style={{ backgroundColor: '#f9f9f9' }}
                >
                  <h4 className="mb-0">Bus {service.bus_no}</h4>
                  <p className="mb-0">
                    Arrival Time: {service.next_bus_mins < 0 ? 'Arrived' : `${service.next_bus_mins} minutes`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
