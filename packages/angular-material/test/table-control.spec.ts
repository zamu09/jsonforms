/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/lib/testing';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule
} from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JsonFormsModule } from '@jsonforms/angular';
import { ControlElement } from '@jsonforms/core';
import { TextControlRenderer, TextControlRendererTester } from '../src';
import {
  TableRenderer,
  TableRendererTester
} from '../src/other/table.renderer';
import { FlexLayoutModule } from '@angular/flex-layout';

const uischema1: ControlElement = { type: 'Control', scope: '#' };
const uischema2: ControlElement = {
  type: 'Control',
  scope: '#/properties/my'
};
const schema_object1 = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      foo: { type: 'string' },
      bar: { type: 'string' }
    }
  }
};
const schema_object2 = {
  type: 'object',
  properties: {
    my: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          bar: { type: 'string' }
        }
      }
    }
  }
};
const schema_simple1 = {
  type: 'array',
  items: {
    type: 'string'
  }
};
const schema_simple2 = {
  type: 'object',
  properties: {
    my: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  }
};
const renderers = [
  { tester: TextControlRendererTester, renderer: TextControlRenderer },
  { tester: TableRendererTester, renderer: TableRenderer }
];

describe('Table tester', () => {
  it('should succeed', () => {
    expect(TableRendererTester(uischema1, schema_object1)).toBe(3);
    expect(TableRendererTester(uischema1, schema_simple1)).toBe(3);
    expect(TableRendererTester(uischema2, schema_object2)).toBe(3);
    expect(TableRendererTester(uischema2, schema_simple2)).toBe(3);
  });
});
describe('Table', () => {
  let fixture: ComponentFixture<any>;
  let component: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableRenderer, TextControlRenderer],
      imports: [
        CommonModule,
        JsonFormsModule,
        NgReduxModule,
        MatCardModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatTableModule
      ],
      providers: [{ provide: NgRedux, useFactory: MockNgRedux.getInstance }]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [TextControlRenderer]
        }
      })
      .compileComponents();

    MockNgRedux.reset();
    fixture = TestBed.createComponent(TableRenderer);
    component = fixture.componentInstance;
  }));

  it('renders object array on root', async(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema1;
    component.schema = schema_object1;

    mockSubStore.next({
      jsonforms: {
        renderers: renderers,
        core: {
          data: [
            { foo: 'foo_1', bar: 'bar_1' },
            { foo: 'foo_2', bar: 'bar_2' }
          ],
          schema: schema_object1
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      // 2 columns
      expect(fixture.nativeElement.querySelectorAll('th').length).toBe(2);
      // 1 head row and 2 data rows
      expect(fixture.nativeElement.querySelectorAll('tr').length).toBe(1 + 2);
      // 4 data entries
      expect(fixture.nativeElement.querySelectorAll('td').length).toBe(4);
    });
  }));
  it('renders object array on path', async(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema2;
    component.schema = schema_object2;

    mockSubStore.next({
      jsonforms: {
        renderers: renderers,
        core: {
          data: {
            my: [{ foo: 'foo_1', bar: 'bar_1' }, { foo: 'foo_2', bar: 'bar_2' }]
          },
          schema: schema_object2
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      // 2 columns
      expect(fixture.nativeElement.querySelectorAll('th').length).toBe(2);
      // 1 head row and 2 data rows
      expect(fixture.nativeElement.querySelectorAll('tr').length).toBe(1 + 2);
      // 4 data entries
      expect(fixture.nativeElement.querySelectorAll('td').length).toBe(4);
    });
  }));

  it('renders simple array on root', async(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema1;
    component.schema = schema_simple1;

    mockSubStore.next({
      jsonforms: {
        renderers: renderers,
        core: {
          data: ['foo', 'bar'],
          schema: schema_simple1
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      // 1 column
      expect(fixture.nativeElement.querySelectorAll('th').length).toBe(1);
      // 1 head row and 2 data rows
      expect(fixture.nativeElement.querySelectorAll('tr').length).toBe(1 + 2);
      // 2 data entries
      expect(fixture.nativeElement.querySelectorAll('td').length).toBe(2);
    });
  }));
  it('renders simple array on path', async(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema2;
    component.schema = schema_simple2;

    mockSubStore.next({
      jsonforms: {
        renderers: renderers,
        core: {
          data: { my: ['foo', 'bar'] },
          schema: schema_simple2
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      // 1 columns
      expect(fixture.nativeElement.querySelectorAll('th').length).toBe(1);
      // 1 head row and 2 data rows
      expect(fixture.nativeElement.querySelectorAll('tr').length).toBe(1 + 2);
      // 2 data entries
      expect(fixture.nativeElement.querySelectorAll('td').length).toBe(2);
    });
  }));

  it('can be disabled', async(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema1;
    component.schema = schema_object1;
    component.disabled = true;

    mockSubStore.next({
      jsonforms: {
        renderers: renderers,
        core: {
          data: [{ foo: 'foo_1', bar: 'bar_1' }],
          schema: schema_object1
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelectorAll('input').length).toBe(2);
      expect(
        fixture.nativeElement.querySelectorAll('input')[0].disabled
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelectorAll('input')[1].disabled
      ).toBeTruthy();
    });
  }));
  it('should be enabled by default', async(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema1;
    component.schema = schema_object1;

    mockSubStore.next({
      jsonforms: {
        renderers: renderers,
        core: {
          data: [{ foo: 'foo_1', bar: 'bar_1' }],
          schema: schema_object1
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelectorAll('input').length).toBe(2);
      expect(fixture.nativeElement.querySelector('input').disabled).toBeFalsy();
    });
  }));
});