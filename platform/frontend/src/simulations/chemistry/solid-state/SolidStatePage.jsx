import { useState, useEffect, useRef, Suspense } from "react";
import SimulationLayout, {
  ControlsPanel,
  ControlSection,
  VisualizationPanel,
  StatCard,
  StatsRow,
  LearningPanel,
  EquationDisplay,
  ParameterSlider,
  SimLoadingState,
  SimErrorState,
} from "../../../components/simulations/SimulationLayout";
import { solidStateApi } from "../../../services/api";
import { getById } from "../../../config/simulatorRegistry";
import CrystalScene from "./CrystalScene";

const SIM = getById("solid-state");

const STRUCTURES = {
  SC: {
    label: "Simple Cubic (SC)",
    atoms: 1,
    cn: 6,
    apf: "52.36%",
    examples: "Polonium",
  },
  BCC: {
    label: "Body-Centered Cubic (BCC)",
    atoms: 2,
    cn: 8,
    apf: "68.02%",
    examples: "Iron, Chromium, Tungsten",
  },
  FCC: {
    label: "Face-Centered Cubic (FCC)",
    atoms: 4,
    cn: 12,
    apf: "74.05%",
    examples: "Aluminum, Copper, Gold",
  },
};

export default function SolidStatePage() {
  const [structure, setStructure] = useState("FCC");
  const [latticeConstant, setLatticeConstant] = useState(4.05);
  const [supercell, setSupercell] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await solidStateApi.compute({
        structure,
        lattice_constant: latticeConstant,
        supercell,
      });
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { run(); }, [structure, latticeConstant, supercell]);

  const meta = STRUCTURES[structure];

  return (
    <SimulationLayout sim={SIM}>
      {/* ── Controls ── */}
      <ControlsPanel title="Crystal Parameters">
        <ControlSection title="Structure Type">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
            {Object.entries(STRUCTURES).map(([key, val]) => (
              <button
                key={key}
                className={`btn ${structure === key ? "btn-primary" : "btn-secondary"} btn-sm`}
                style={{ justifyContent: "flex-start" }}
                onClick={() => setStructure(key)}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{key}</span>
                &nbsp;— {val.label.split(" (")[0]}
              </button>
            ))}
          </div>
        </ControlSection>

        <ControlSection title="Lattice Constant">
          <ParameterSlider
            id="lattice-a"
            label="a"
            value={latticeConstant}
            min={2.5}
            max={6.0}
            step={0.05}
            unit=" Å"
            onChange={setLatticeConstant}
          />
        </ControlSection>

        <ControlSection title="Supercell Size">
          <ParameterSlider
            id="supercell"
            label="n × n × n"
            value={supercell}
            min={1}
            max={3}
            step={1}
            unit="×"
            onChange={setSupercell}
          />
        </ControlSection>

        <ControlSection title="Structure Info">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
            {[
              ["Atoms/cell", meta.atoms],
              ["Coordination #", meta.cn],
              ["APF", meta.apf],
              ["Examples", meta.examples],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                <span style={{ color: "var(--clr-text-muted)" }}>{k}</span>
                <span style={{ color: "var(--clr-text-primary)", fontFamily: "var(--font-mono)" }}>{v}</span>
              </div>
            ))}
          </div>
        </ControlSection>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
          <EquationDisplay label="Packing Fraction" equation={`APF = (Z·(4/3)πr³) / a³`} />
        </div>
      </ControlsPanel>

      {/* ── Visualization ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        <VisualizationPanel
          title={`${STRUCTURES[structure].label} — 3D Crystal Lattice`}
          actions={
            loading && (
              <span style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)" }}>
                Computing…
              </span>
            )
          }
        >
          {error ? (
            <SimErrorState error={error} onRetry={run} />
          ) : (
            <div style={{ height: "460px", position: "relative" }}>
              <CrystalScene
                atoms={data?.atoms || []}
                structure={structure}
                atomRadius={data?.atom_radius || latticeConstant * 0.35}
                latticeConstant={latticeConstant}
                supercell={supercell}
              />
              {loading && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  background: "rgba(5,7,26,0.6)", borderRadius: "var(--radius-md)"
                }}>
                  <SimLoadingState message="Building crystal lattice…" />
                </div>
              )}
            </div>
          )}
        </VisualizationPanel>

        {data && (
          <StatsRow>
            <StatCard label="Atoms/Cell" value={data.atoms_per_unit_cell} />
            <StatCard label="Coord. Number" value={data.coordination_number} />
            <StatCard label="Packing Eff." value={`${data.packing_efficiency_percent}%`} />
            <StatCard label="Void Fraction" value={`${data.void_fraction}%`} />
            <StatCard label="Cell Volume" value={data.unit_cell_volume} unit="ų" />
            <StatCard label="Atom Radius" value={data.atom_radius?.toFixed(3)} unit="Å" />
          </StatsRow>
        )}

        <LearningPanel objectives={SIM.learningObjectives} />
      </div>
    </SimulationLayout>
  );
}
