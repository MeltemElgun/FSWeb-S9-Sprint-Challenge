import React from "react";
import { useState } from "react";
import axios from "axios";

// önerilen başlangıç stateleri
// const initialMessage = "";
// const initialEmail = "";
// const initialSteps = 0;
// const initialIndex = 4; "B" nin bulunduğu indexi
const startData = {
  message: "",
  email: "",
  steps: 0,
  index: 4,
};

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  const [data, setData] = useState(startData);
  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    let coordinates = {
      x: (data.index % 3) + 1,
      y: Math.floor(data.index / 3) + 1,
    };
    return coordinates;
  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    return `Koordinatlar (${getXY().x} - ${getXY().y})`;
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setData(startData);
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    let indexte = data.index;
    if (yon === "left") {
      if (data.index % 3 !== 0) indexte = data.index - 1;
      else setData({ ...data, ["message"]: "Sola gidemezsiniz" });
    }
    if (yon === "right") {
      if (data.index % 3 !== 2) indexte = data.index + 1;
      else setData({ ...data, ["message"]: "Sağa gidemezsiniz" });
    }
    if (yon === "up") {
      if (Math.floor(data.index / 3) !== 0) indexte = data.index - 3;
      else setData({ ...data, ["message"]: "Yukarıya gidemezsiniz" });
    }
    if (yon === "down") {
      if (Math.floor(data.index / 3) !== 2) indexte = data.index + 3;
      else setData({ ...data, ["message"]: "Aşağıya gidemezsiniz" });
    }

    return indexte;
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    let newYon = sonrakiIndex(evt.target.id);
    newYon !== data.index &&
      setData({
        ...data,
        ["message"]: "",
        ["steps"]: data.steps + 1,
        ["index"]: newYon,
      });
    console.log(newYon);
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    evt.target.id === "reset" && reset();
    evt.target.id === "email" &&
      setData({ ...data, ["email"]: evt.target.value });
    evt.target.id !== "reset" && evt.target.id !== "email" && ilerle(evt);
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault();
    let post = {
      x: getXY().x,
      y: getXY().y,
      steps: data.steps,
      email: data.email,
    };
    console.log("email", data.email);

    if (post.email === "") {
      setData({ ...data, ["message"]: "Ouch: email is required" });
    } else {
      axios
        .post("http://localhost:9000/api/result", post)
        .then((result) => {
          setData({ ...data, ["email"]: "", ["message"]: result.data.message });
        })
        .catch((err) =>
          setData({ ...data, ["message"]: err.response.data.message })
        );
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{data.steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === data.index ? " active" : ""}`}
          >
            {idx === data.index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{data.message}</h3>
      </div>
      <div id="keypad">
        <button onClick={onChange} id="left">
          SOL
        </button>
        <button onClick={onChange} id="up">
          YUKARI
        </button>
        <button onClick={onChange} id="right">
          SAĞ
        </button>
        <button onClick={onChange} id="down">
          AŞAĞI
        </button>
        <button onClick={onChange} id="reset">
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          id="email"
          type="email"
          placeholder="email girin"
          value={data.email}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
