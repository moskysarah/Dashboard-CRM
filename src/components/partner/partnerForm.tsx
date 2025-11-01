import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { createPartner } from "../../services/partners";

const PartnerForm = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPartner(form);
      alert("Partenaire ajouté !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Créer un nouveau partenaire</h2>
      <Input label="Nom" name="name" value={form.name} onChange={handleChange} required />
      <Input label="Email" name="email" value={form.email} onChange={handleChange} required />
      <Button type="submit" disabled={loading}>
        {loading ? "Sauvegarde..." : "Sauvegarder"}
      </Button>
    </form>
  );
};

export default PartnerForm;
