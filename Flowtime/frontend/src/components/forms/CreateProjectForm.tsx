import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import Drawer from "@mui/material/Drawer";

import { useState } from "react";

import useProjects from "../../hooks/useProjects";

export default function CreateProjectForm({}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                Ouvrir drawer
            </Button>{" "}
            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: { width: "100%" }, // plein écran
                }}
            >
                <div style={{ padding: 24 }}>
                    <h2>Contenu du Drawer</h2>

                    <Button variant="outlined" onClick={() => setOpen(false)}>
                        Fermer
                    </Button>
                </div>
                {/* contenu : form, boutons, header */}
            </Drawer>
        </>
    );
}
