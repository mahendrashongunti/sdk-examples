import React, { useState } from 'react'
import { AccessRequest, AccessType } from '../types'
import './RequestForm.css'

interface RequestFormProps {
    request: AccessRequest | null
    accessTypes: AccessType[]
    onSubmit: (data: any) => void
    onCancel: () => void
}

export default function RequestForm({ request, accessTypes, onSubmit, onCancel }: RequestFormProps) {
    const getValue = (field: any) => {
        return typeof field === 'object' ? field.value : field
    }

    const [formData, setFormData] = useState({
        access_type: request ? getValue(request.access_type) : '',
        business_justification: request ? getValue(request.business_justification) : '',
        required_date: request ? getValue(request.required_date) : '',
        priority: request ? getValue(request.priority) : '3',
        is_emergency: request ? getValue(request.is_emergency) : false,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        })
    }

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{request ? 'Edit Access Request' : 'New Access Request'}</h2>
                    <button className="close-button" onClick={onCancel}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="access_type">Access Type *</label>
                        <select
                            id="access_type"
                            name="access_type"
                            value={formData.access_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select access type...</option>
                            {accessTypes.map((type) => (
                                <option key={getValue(type.sys_id)} value={getValue(type.sys_id)}>
                                    {getValue(type.name)} - {getValue(type.category)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="business_justification">Business Justification *</label>
                        <textarea
                            id="business_justification"
                            name="business_justification"
                            value={formData.business_justification}
                            onChange={handleChange}
                            rows={4}
                            required
                            minLength={20}
                            placeholder="Provide a detailed business justification for this access request (minimum 20 characters)..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="required_date">Required Date *</label>
                        <input
                            type="date"
                            id="required_date"
                            name="required_date"
                            value={formData.required_date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="1">Critical</option>
                            <option value="2">High</option>
                            <option value="3">Medium</option>
                            <option value="4">Low</option>
                        </select>
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="is_emergency"
                                checked={formData.is_emergency}
                                onChange={handleChange}
                            />
                            Emergency Request (will be prioritized)
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            {request ? 'Update' : 'Create'} Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
