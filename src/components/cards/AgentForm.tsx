import React, { useState, useEffect } from "react";
import type { Agent, CreateAgentData, UpdateAgentData } from "../../types/Agent";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface AgentFormProps {
  agent?: Agent;
  onSuccess?: () => void;
  onCancel: () => void;
  onSubmit: (data: CreateAgentData | UpdateAgentData) => Promise<void>;
}

const AgentForm: React.FC<AgentFormProps> = ({ agent, onSuccess, onCancel, onSubmit }) => {
  const [firstName, setFirstName] = useState(agent?.first_name || "");
  const [lastName, setLastName] = useState(agent?.last_name || "");
  const [email, setEmail] = useState(agent?.email || "");
  const [phone, setPhone] = useState(agent?.phone || "");
  const [region, setRegion] = useState(agent?.region || "");
  const [isActive, setIsActive] = useState(agent?.is_active ?? true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (agent) {
      setFirstName(agent.first_name);
      setLastName(agent.last_name);
      setEmail(agent.email);
      setPhone(agent.phone || "");
      setRegion(agent.region || "");
      setIsActive(agent.is_active);
    }
  }, [agent]);

  const validateForm = () => {
    if (!firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email is not valid");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    try {
      if (agent) {
        // update
        const updateData: UpdateAgentData = {
          first_name: firstName,
          last_name: lastName,
          email,
          phone: phone || undefined,
          region: region || undefined,
          is_active: isActive,
        };
        await onSubmit(updateData);
      } else {
        // create
        const createData: CreateAgentData = {
          first_name: firstName,
          last_name: lastName,
          email,
          phone: phone || undefined,
          region: region || undefined,
        };
        await onSubmit(createData);
      }
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setError(e.message || "An error occurred while saving the agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="agent-form">
      <Input
        label="First Name"
        value={firstName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
        required
      />
      <Input
        label="Last Name"
        value={lastName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Phone"
        value={phone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
      />
      <Input
        label="Region"
        value={region}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegion(e.target.value)}
      />
      {agent && (
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsActive(e.target.checked)}
            />{" "}
            Active
          </label>
        </div>
      )}
      {error && <p className="form-error">{error}</p>}
      <div className="form-buttons">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : agent ? "Update Agent" : "Create Agent"}
        </Button>
        <Button type="button" onClick={onCancel} disabled={loading} variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AgentForm;
