import { Head } from './Visualizer'
import MessageTable from './MessageTable'
export default function SearchPanel({ text, setText, built, result, status, busy, onBuild, onSearch, isMock, go }) {
  const byPat = result ? result.patterns.map((p) => { const m = result.matches.filter((x) => x.pattern === p); return { p, n: m.length, pos: m.slice(0, 6).map((x) => x.position) } }) : []
  return (
    <section>
      <Head title="Search Dataset" sub="Enter several patterns separated by commas. Build the automaton once, then scan the whole dataset." />
      {isMock && <div className="note">Demo data layer active: results come from a placeholder, not from Aho–Corasick. Connect the Java backend in <code>src/services/api.js</code>.</div>}
      <div className="glass">
        <label className="big">Patterns<input value={text} onChange={(e) => setText(e.target.value)} placeholder="free, winner, cash, prize" spellCheck="false" /></label>
        <div className="btns">
          <button className="btn" onClick={onBuild} disabled={busy}>Build Automaton</button>
          <button className="btn primary" onClick={onSearch} disabled={busy}>Search Dataset</button>
          <span className="pill"><i className={'dot ' + (busy ? 'busy' : built ? 'ok' : '')} />{status}</span>
        </div>
        {built && <p className="muted mono">automaton: {built.patternCount} patterns, {built.nodeCount} nodes, built in {built.buildMs} ms</p>}
      </div>
      {result && (<>
        <div className="cards">
          <div className="glass stat"><small>Matched messages</small><strong>{result.matchedMessages.toLocaleString()}</strong></div>
          <div className="glass stat"><small>Occurrences</small><strong>{result.totalOccurrences.toLocaleString()}</strong></div>
          <div className="glass stat"><small>Execution time</small><strong>{result.executionMs} ms</strong></div>
        </div>
        <div className="glass"><h3>Patterns and positions</h3>
          <div className="scroll"><table><thead><tr><th>Pattern</th><th>Occurrences</th><th>First positions (char index)</th></tr></thead>
            <tbody>{byPat.map((r) => <tr key={r.p}><td><span className="tag">{r.p}</span></td><td className="mono">{r.n.toLocaleString()}</td><td className="mono">{r.pos.join(', ') || '—'}</td></tr>)}</tbody></table></div>
        </div>
        <div className="glass"><h3>Matching SMS messages <small className="muted">(first 8)</small></h3>
          <MessageTable rows={result.matches.slice(0, 8)} />
          <button className="btn ghost more" onClick={() => go('matches')}>Open all matches</button></div>
      </>)}
    </section>
  )
}
