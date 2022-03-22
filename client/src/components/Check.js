import { API } from "../config/api";
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import "../styles/home.css";

export default () => {
  const [provinces, setProvinces] = useState([]);
  const [cities1, setCities1] = useState([]);
  const [cities2, setCities2] = useState([]);
  const [costList, setCostList] = useState([]);
  const [asal, setAsal] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [berat, setBerat] = useState("");
  const [kurir, setKurir] = useState("");

  useEffect(() => {
    getProvinces();
  }, [provinces]);

  const valAsal = (val) => {
    setAsal(val);
  };
  const valTujuan = (val) => {
    setTujuan(val);
  };
  const valBerat = (val) => {
    setBerat(val);
  };
  const valKurir = (val) => {
    setKurir(val);
  };

  const getProvinces = async () => {
    try {
      const resp = await API.get(`/provinsi`);
      setProvinces(resp.data.rajaongkir.results);
    } catch (err) {
      console.log(err);
    }
  };

  const getCity1 = async (idProv1) => {
    try {
      const resp = await API.get(`/kota/${idProv1}`);
      setCities1(resp.data.rajaongkir.results);
    } catch (err) {
      console.log(err);
    }
  };

  const getCity2 = async (idProv2) => {
    try {
      const resp = await API.get(`/kota/${idProv2}`);
      setCities2(resp.data.rajaongkir.results);
    } catch (err) {
      console.log(err);
    }
  };

  const getCost = async (e) => {
    e.preventDefault();
    try {
      const resp = await API.get(`ongkos/${asal}/${tujuan}/${berat}/${kurir}`);
      setCostList(resp.data.rajaongkir.results[0].costs);
      console.log(resp.data.rajaongkir.results[0].costs);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-home">
      <div className="container-check">
        <div className="check-from-to">
          <h2 style={{ color: "grey", marginBottom: "25px" }}>Kota Asal</h2>
          <h4>Pilih provinsi</h4>
          <select
            name="prov1"
            id="prov1"
            onChange={(e) => getCity1(e.target.value)}
          >
            <option value="">-- Pilih Provinsi --</option>
            {provinces.map((item) => (
              <option value={item.province_id} key={item.province_id}>
                {item.province}
              </option>
            ))}
          </select>
          <h4>Pilih kota</h4>
          <select
            name="kot1"
            id="kot1"
            onChange={(e) => valAsal(e.target.value)}
          >
            <option value="">-- Pilih kota --</option>
            {cities1.map((item) => (
              <option value={item.city_id} key={item.city_id}>
                {item.type} {item.city_name}
              </option>
            ))}
          </select>
          <div>
            <h4>Berat (gram)</h4>
            <input
              type="number"
              name="berat"
              id="berat"
              onChange={(e) => valBerat(e.target.value)}
            />
          </div>
        </div>
        <div className="check-from-to">
          <h2 style={{ color: "grey", marginBottom: "25px" }}>Kota Tujuan</h2>
          <h4>Pilih provinsi</h4>
          <select
            name="prov2"
            id="prov2"
            onChange={(e) => getCity2(e.target.value)}
          >
            <option value="">-- Pilih provinsi --</option>
            {provinces.map((item) => (
              <option value={item.province_id} key={item.province_id}>
                {item.province}
              </option>
            ))}
          </select>
          <h4>Pilih kota</h4>
          <select
            name="kot2"
            id="kot2"
            onChange={(e) => valTujuan(e.target.value)}
          >
            <option value="">-- Pilih Kota --</option>
            {cities2.map((item) => (
              <option value={item.city_id} key={item.city_id}>
                {item.type} {item.city_name}
              </option>
            ))}
          </select>
          <div>
            <h4>Kurir</h4>
            <select
              id="kurir"
              name="kurir"
              onChange={(e) => valKurir(e.target.value)}
            >
              <option value="">-- Pilih layanan --</option>
              <option value="jne">JNE</option>
              <option value="pos">POS Indonesia</option>
              <option value="tiki">TIKI</option>
            </select>
          </div>
        </div>
      </div>
      <div className="container-check ms-3">
        <button onClick={getCost} className="btn btn-primary px-5 py-3">
          Cek Ongkir
        </button>
      </div>
      <div className="container-check ms-3">
        <div>
          {costList.map((item, index) => (
            <Card
              key={index}
              style={{
                width: "350px",
                height: "auto",
                marginBottom: "1rem",
                backgroundColor: "#faebd7",
              }}
            >
              <Card.Body>
                <div className="d-flex flex-column justify-content-between">
                  <b>{item.service}</b>
                  <i>Rp. {item.cost[0].value}</i>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
